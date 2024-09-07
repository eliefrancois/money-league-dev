// import { useContext, useState, useCallback, createContext } from 'react';
// const { Client } = require("espn-fantasy-football-api/node");



// interface ESPNClientContextType {
//   client: typeof Client | null;
//   setLeagueId: (leagueId: number) => void;
//   setCookies: (cookies: { espnS2: string; SWID: string }) => void;
// }

// const ESPNClientContext = createContext<ESPNClientContextType | undefined>(undefined);

// export function ESPNClientProvider({ children }: { children: React.ReactNode }) {
//   const [client, setClient] = useState<typeof Client | null>(null);

//   const setLeagueId = useCallback((leagueId: number) => {
//     setClient(new Client({ leagueId }));
//   }, []);

//   const setCookies = useCallback((cookies: { espnS2: string; SWID: string }) => {
//     if (client) {
//       client.setCookies(cookies);
//     }
//   }, [client]);

//   return (
//     <ESPNClientContext.Provider value={{ client, setLeagueId, setCookies }}>
//       {children}
//     </ESPNClientContext.Provider>
//   );
// }

// export function useESPNClient() {
//   const context = useContext(ESPNClientContext);
//   if (context === undefined) {
//     throw new Error('useESPNClient must be used within a ESPNClientProvider');
//   }
//   return context;
// }