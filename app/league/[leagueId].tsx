import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
export default function LeaguePage() {
    const { leagueId } = useLocalSearchParams();
    const [data, setData] = useState<LeagueDetails | null>(null);
    
    interface LeagueDetails {
        current_fantasy_week: number;
        current_nfl_week: number;
        league_id: number;
        name: string;
        standings: TeamStanding[];
        teams: TeamInfo[];
        year: number;
      }
      
      interface TeamStanding {
        logo: string;
        losses: number;
        points_against: number;
        points_for: number;
        team_name: string;
        ties: number;
        wins: number;
      }
      
      interface TeamInfo {
        logo: string;
        losses: number;
        points_against: number;
        points_for: number;
        team_name: string;
        ties: number;
        wins: number;
      }

    useEffect(() => {
        async function fetchLeagueDetails() {
            const storedCookies = await SecureStore.getItemAsync('espnCookies');
            const year = new Date().getFullYear();
            console.log("year in LeaguePage",year);
            if (!storedCookies) {
                console.error('No stored cookies found');
                return;
            }
            const parsedCookies = JSON.parse(storedCookies); // TODO: fix this later shouldnt assert presence of cookies i should check if its null or undefined
            const response = await fetch(`/api/getUserLeaguesDetails?leagueId=${leagueId}&year=${year}`, {
                headers: {
                    'X-SWID': parsedCookies.SWID,
                    'X-ESPN-S2': parsedCookies.espn_s2
                }
            });
            const responseData = await response.json();
            setData(responseData);
            console.log("data from Flask API: /api/user-leagues/details/<string:league_id>/<string:year>",data);
        }
        fetchLeagueDetails();
    }, []);
    
  return (
    <>
        <View style={styles.container}>
            <Text> League Name: {data?.name}</Text>
        {/* TODO: iterate through the teams and display them */}
        {data?.standings.map((standing, index) => (
            <View key={index}>
                <Text>Team Name: {standing.team_name}</Text>
                <Text>Record: {standing.wins}-{standing.losses}-{standing.ties}</Text>
                <Text>Points For: {standing.points_for}</Text>
                <Text>Points Against: {standing.points_against}</Text>
            </View>
        ))}
    </View>
    </>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})