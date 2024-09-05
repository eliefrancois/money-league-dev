import { Button, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export default function TabOneScreen() {
  const [cookies, setCookies] = useState<{ SWID?: string, espn_s2?: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function checkLoginStatus() {
        const storedCookies = await SecureStore.getItemAsync('espnCookies');
        if (storedCookies) {
          setIsLoggedIn(true);
          setCookies(JSON.parse(storedCookies));
        }
      }
      checkLoginStatus();
    }, [])
  );

  if (isLoggedIn) {
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
        onPress={() => {
          setIsLoggedIn(false);
          setCookies(null);
          SecureStore.deleteItemAsync('espnCookies');
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
