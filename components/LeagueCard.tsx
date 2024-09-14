import { League } from "@/app/api/types/getAllLeaguesAPITypes";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import { SvgUri } from "react-native-svg";

interface LeagueCardProps {
  league: League;
  leagueId: string;
}

export const LeagueCard: React.FC<LeagueCardProps> = ({ league, leagueId }) => {
  return (
<TouchableOpacity style={styles.touchable}>
      <View style={styles.card}>
        <View style={styles.contentContainer}>
          <SvgUri width="60" height="60" uri={league.teamLogo} />
          <View style={styles.infoContainer}>
            <Text style={styles.leagueName}>{league.leagueName}</Text>
            <Text style={styles.teamName}>{league.teamName}</Text>
            <Text style={styles.record}>
              Record: {league.teamWins}-{league.teamLosses}-{league.teamTies}
            </Text>
          </View>
        </View>
        {league.inSeason && (
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => {
              router.push({
                pathname: '/league/[leagueId]',
                params: { leagueId: leagueId }
              });
            }}
          >
            <FontAwesome name="plus" size={20} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>  );
};

const styles = StyleSheet.create({
  touchable: {
    width: "100%",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  leagueName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  teamName: {
    fontSize: 16,
    marginBottom: 5,
  },
  record: {
    fontSize: 14,
    color: "#666",
  },
  rank: {
    fontSize: 14,
    color: "#666",
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginLeft: 10,
  },
});
