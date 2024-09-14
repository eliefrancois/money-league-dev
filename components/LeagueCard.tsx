import { League } from "@/app/api/types/getAllLeaguesAPITypes";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SvgUri } from "react-native-svg";

interface LeagueCardProps {
  league: League;
}

export const LeagueCard: React.FC<LeagueCardProps> = ({ league }) => {
  return (
    <TouchableOpacity style={styles.touchable}>
    <View style={styles.card}>
      <SvgUri width="60" height="60" uri={league.teamLogo} />
      <View style={styles.infoContainer}>
        <Text style={styles.leagueName}>{league.leagueName}</Text>
        <Text style={styles.teamName}>{league.teamName}</Text>
        <Text style={styles.record}>
          Record: {league.teamWins}-{league.teamLosses}-{league.teamTies}
        </Text>
        <Text style={styles.rank}>Rank: {league.teamRank}</Text>
      </View>
    </View>
    </TouchableOpacity>
  );
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
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
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
});
