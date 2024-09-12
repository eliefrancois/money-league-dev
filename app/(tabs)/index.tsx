import { Button, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { League, RawPreference, RawUserLeaguesData, UserLeaguesData } from '../api/types/getAllLeaguesAPITypes';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function TabOneScreen() {
  const [cookies, setCookies] = useState<{ SWID?: string, espn_s2?: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [leagueData, setLeagueData] = useState<UserLeaguesData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const testAPI = async () => {
    const response = await fetch('/api/flasktest');
    const data = await response.json();
    setApiResponse(data);
    console.log(data);
  }

  const fetchAndParseLeagueData = useCallback(async (storedCookies: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("in fetchAndParseLeagueData() calling Flask API");
      const parsedCookies = JSON.parse(storedCookies);
      const response = await fetch('/api/getAllLeagues', {
        headers: {
          'X-SWID': parsedCookies.SWID,
          'X-ESPN-S2': parsedCookies.espn_s2
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rawData: RawUserLeaguesData = await response.json();
      console.log("Flask API response parsing now ", rawData);
      const parsedData = parseUserLeagueData(rawData, parsedCookies.SWID);
      console.log('Done Parsing League Data:', parsedData);
      
      setLeagueData(parsedData);
      await AsyncStorage.setItem('leagueData', JSON.stringify(parsedData));
      await AsyncStorage.setItem('leagueDataUser', parsedCookies.SWID);
      console.log("League Data saved to Async Storage");
    } catch (error) {
      console.error("Error fetching league data:", error);
      setError("Failed to fetch league data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkLoginStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const storedCookies = await SecureStore.getItemAsync('espnCookies');
      if (storedCookies) {
        console.log("Cookies found in async storage ",storedCookies);
        const parsedCookies = JSON.parse(storedCookies);
        setCookies(parsedCookies);
        setIsLoggedIn(true);
  
        const storedLeagueData = await AsyncStorage.getItem('leagueData');
        const storedLeagueDataUser = await AsyncStorage.getItem('leagueDataUser');
        
        if ((storedLeagueData) && (storedLeagueDataUser === parsedCookies.SWID)) {
          console.log("League Data Found in Async Storage, setting league data", storedLeagueData);
          setLeagueData(JSON.parse(storedLeagueData));
        } 
        else {
          console.log("Fetching League Data calling fetchAndParseLeagueData()");
          await fetchAndParseLeagueData(storedCookies);
        }
      } else {
        console.log("No cookies found in async storage");
        setIsLoggedIn(false);
        setCookies(null);
        setLeagueData(null);
        await AsyncStorage.removeItem('leagueData');
        await AsyncStorage.removeItem('leagueDataUser');
      }

    }
    catch (err) {
      setError(`Error checking login status: ${err}`);
    }
    finally {
      setIsLoading(false);
    }
  }, [fetchAndParseLeagueData]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  useFocusEffect(
    useCallback(() => {
      checkLoginStatus();
    }, [checkLoginStatus])
  );
  
  const parseUserLeagueData = (data: RawUserLeaguesData, swid: string): UserLeaguesData | null => {
    if (!data || !Array.isArray(data.preferences)) {
      console.error('Invalid data structure');
      return null;
    }
  
    const leagues = data.preferences.reduce((acc: { [leagueId: string]: League }, pref: RawPreference) => {
      const entry = pref.metaData?.entry;
      const group = entry?.groups[0];
      if (!entry || !group) return acc;
  
      const leagueId = group.groupId;
      acc[leagueId] = {
        teamName: entry.entryMetadata.teamName,
        teamAbbrev: entry.entryMetadata.teamAbbrev,
        active: entry.entryMetadata.active,
        draftComplete: entry.entryMetadata.draftComplete,
        draftInProgress: entry.entryMetadata.draftInProgress,
        inSeason: pref.metaData.inSeason,
        isLive: pref.metaData.isLive,
        currentScoringPeriodId: pref.metaData.currentScoringPeriodId,
        teamId: entry.entryId,
        teamWins: entry.wins || 0,
        teamLosses: entry.losses || 0,
        teamTies: entry.ties || 0,
        teamRank: entry.rank || 0,
        teamPoints: entry.points || 0,
        teamLogo: entry.logoUrl,
        leagueName: group.groupName,
        leagueManager: group.groupManager,
        seasonId: entry.seasonId,
      };
      return acc;
    }, {});
  
    return {
      leagues,
      profile: {
        lastName: data.profile.lastName,
        firstName: data.profile.firstName,
        email: data.profile.email,
        userName: data.profile.userName,
        swid: swid,
      }
    };
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     async function checkLoginStatus() {
  //       const storedCookies = await SecureStore.getItemAsync('espnCookies');
  //       if (storedCookies) {

  //         console.log("Cookies",storedCookies);
  //         console.log("SWID  ",JSON.parse(storedCookies).SWID);
  //         console.log("espn_s2  ",JSON.parse(storedCookies).espn_s2);
  //         console.log("Calling Flask API");
  //         const response = await fetch('/api/getAllLeagues', {
  //           headers: {
  //             'X-SWID': JSON.parse(storedCookies).SWID,
  //             'X-ESPN-S2': JSON.parse(storedCookies).espn_s2
  //           }
  //         });
          
  //         const data = await response.json();

  //         // Parse the league data
  //         const parsedData = parseUserLeagueData(data, JSON.parse(storedCookies).SWID);
  //         console.log('Parsed League Data:', parsedData);
          
  //         setIsLoggedIn(true);
  //         setCookies(JSON.parse(storedCookies));
  //       }
  //     }
  //     checkLoginStatus();
  //   }, [])
  // );

  
  if (apiResponse) {
    return (
      <>
      <View style={styles.container}>
        <Text style={styles.title}>API Response</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.text}>{JSON.stringify(apiResponse)}</Text>
      </View>
      <Button 
        title="Test API"
        onPress={() => setApiResponse(null)}
      />
      </>
    );
  }

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  
  if (error) {
    return <Text>{error}</Text>;
  }

  if (isLoggedIn && leagueData) {
    return (
      <>
      <View style={styles.container}>
        <Text style={styles.title}>Login Successful!</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.text}>SWID: {cookies?.SWID}</Text>
        <Text style={styles.text}>espn_s2: {cookies?.espn_s2}</Text>
      </View>
      <Button 
        title="Logout"
        onPress={async() => {
          console.log("Logging out, deleting Cookies and League Data");
          setIsLoggedIn(false);
          setCookies(null);
          setLeagueData(null);
          await SecureStore.deleteItemAsync('espnCookies');
          await AsyncStorage.removeItem('leagueData');
          await AsyncStorage.removeItem('leagueDataUser');
        }}
      />  
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sync your ESPN account</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button 
        title="Sync to ESPN"
        onPress={() => router.push('/ESPNLogin')}
      />
      <Button 
        title="Test API"
        onPress={() => testAPI()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  text: {
    fontSize: 13,
    color: 'gray',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontWeight: '400',
    textTransform: 'uppercase',
  }
});
