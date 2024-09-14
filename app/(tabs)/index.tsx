import { Button, ScrollView, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { League, RawPreference, RawUserLeaguesData, UserLeaguesData } from '../api/types/getAllLeaguesAPITypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LeagueCard } from '@/components/LeagueCard';
import Toast from 'react-native-toast-message';


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
      // console.log("storedCookies:", storedCookies);
      console.log("Using hardcoded cookies:", storedCookies);
      const parsedCookies = JSON.parse(storedCookies);

      if (!parsedCookies.SWID || !parsedCookies.espn_s2) {
        console.log("Missing SWID or espn_s2 cookie.");
        return;
        // throw new Error("Missing SWID or espn_s2 cookie.");
      }
      const response = await fetch('/api/getUserLeagues', {
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
      // const storedCookies = await SecureStore.getItemAsync('espnCookies');

      const storedCookies = JSON.stringify({SWID: "{C8039E86-7235-4500-88E7-392008387479}", espn_s2: "AEAxtVlZVu8KX8O5XvNn89hlSJfUejAu3/aCU0wkUjMShofM5KrSkKu4OLQPptl+Rh58TXIkNh4ibdoYfOdEFE21NksFPQnrXvE52YXH6L//zi46wCpC+TYBcxJLp6Idy8kjuZ4B8L7GOxTiFw0da4lWdC7vcw0t5cjSIrQR6L5gl+6myJF21l7wM879MgnCq0XG32+xGaAeiAoO9Q0RznIExwKiEjnLx+C2udcTwb3eeHkjB1uSefy7nJlOewCFqSXCrzgc2kfzU2A4WfROV6B9xTRYa4Bc/F92o6BHBlAE/g=="});

      if (storedCookies) {
        console.log("Using hardcoded cookies:", storedCookies);
        // console.log("Cookies found in async storage ",storedCookies);
        const parsedCookies = JSON.parse(storedCookies);
        setCookies(parsedCookies);
        setIsLoggedIn(true);
  
        const storedLeagueData = await AsyncStorage.getItem('leagueData');
        const storedLeagueDataUser = await AsyncStorage.getItem('leagueDataUser');

        console.log("Stored league data:", storedLeagueData);
        console.log("Stored league data user:", storedLeagueDataUser);
        console.log("Parsed cookies SWID:", parsedCookies.SWID);
        console.log("typeof storedLeagueData:", typeof storedLeagueData);

        const condition = (storedLeagueData != null) && (storedLeagueData !== "null") && (storedLeagueDataUser === parsedCookies.SWID); //if true, league data is in Async Storage and user is the same as when the league data was saved 
        console.log("Condition result:", condition);
        
        
        if ((storedLeagueData != null) && (storedLeagueData !== "null") && (storedLeagueDataUser === parsedCookies.SWID)) {
          console.log("League Data Found in Async Storage and user is the same as when the league data was saved, setting league data", storedLeagueData);
          setLeagueData(JSON.parse(storedLeagueData));
          await SecureStore.setItemAsync('espnCookies', storedCookies);
        }
        else if ((storedLeagueData == null) || (storedLeagueData === "null") || (storedLeagueDataUser !== parsedCookies.SWID)) {
          console.log("League Data not found in Async Storage or user is different from when the league data was saved, fetching League Data calling fetchAndParseLeagueData()");
          await fetchAndParseLeagueData(storedCookies);
        }
      } else {
        console.log("No cookies found in async storage, setting isLoggedIn to false and clearing cookies and league data");
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
  
if (apiResponse) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>API Response</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.text}>{JSON.stringify(apiResponse)}</Text>
        <Button 
          title="Clear API Response"
          onPress={() => setApiResponse(null)}
        />
      </View>
    );
  }

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }
  
  if (error) {
    return <View style={styles.container}><Text>{error}</Text></View>;
  }

  if (isLoggedIn && leagueData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your Leagues</Text>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {Object.entries(leagueData.leagues).map(([leagueId, league]) => (
            <LeagueCard key={`${leagueId}-${league.teamId}`} league={league} leagueId={leagueId} />
          ))}
        </ScrollView>
        <Button 
          title="Logout"
          onPress={async() => {
            console.log("Logging out, deleting Cookies and League Data");
            setIsLoggedIn(false);
            setCookies(null);
            setLeagueData(null);
            // await SecureStore.deleteItemAsync('espnCookies');
            // await AsyncStorage.removeItem('leagueData');
            // await AsyncStorage.removeItem('leagueDataUser');
          }}
        />
      </View>
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
    padding: 20,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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