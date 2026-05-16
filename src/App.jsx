import React, { useState, useMemo, useEffect } from 'react';
import { Authenticator, Button, Heading, useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data';
import * as Recharts from 'recharts';

// --- Amplify Configuration ---
// The Schema type is imported from your backend definition
import { type Schema as BackendSchema } from '../amplify/data/resource'; 

// NOTE: The main Amplify.configure() call and style imports are in your main.tsx.

const client = generateClient<BackendSchema>();

// --- Type Alias for Clarity ---
// This creates a specific TypeScript type for an Order based on your schema
type Order = BackendSchema['Order'];

// --- Main Application Logic Component ---
// This component only renders *after* a user has successfully signed in.
function App() {
    const { signOut } = useAuthenticator();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // This effect runs once after the component mounts to fetch all orders.
    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                // This is the live query to your DynamoDB table.
                const response = await client.models.Order.list();
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllOrders();

        // This sets up a real-time subscription to listen for new orders.
        const sub = client.models.Order.onCreate().subscribe(newOrder => {
            // When a new order is created, we add it to the top of our list.
            setOrders(prevOrders => [newOrder, ...prevOrders]);
        });

        // This cleans up the subscription when the component is unmounted.
        return () => sub.unsubscribe();
    }, []);

    // This useMemo hook processes the raw order data specifically for the chart.
    // It only recalculates when the 'orders' state changes, which is efficient.
    const chartData = useMemo(() => {
        const statusCounts = orders.reduce((acc, order) => {
            const status = order.status ?? 'UNKNOWN';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return Object.entries(statusCounts).map(([name, value]) => ({ name, orders: value }));
    }, [orders]);

    return (
        <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
            <header className="bg-slate-800 p-4 flex justify-between items-center">
                <Heading level={5} className="text-white">Order Dashboard</Heading>
                <Button onClick={signOut} variation="primary" size="small">Sign Out</Button>
            </header>

            <main className="p-4 md:p-8">
                {loading ? (
                    <p>Loading chart data...</p>
                ) : (
                    <div className="bg-slate-800 p-4 rounded-lg shadow-md max-w-4xl mx-auto">
                        <h2 className="text-lg font-semibold text-white mb-4">Today's Order Status</h2>
                        <div style={{ width: '100%', height: 300 }}>
                            <Recharts.ResponsiveContainer>
                                <Recharts.BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <Recharts.XAxis dataKey="name" stroke="#94a3b8" />
                                    <Recharts.YAxis stroke="#94a3b8" />
                                    <Recharts.Tooltip 
                                        cursor={{fill: 'rgba(100, 116, 139, 0.2)'}}
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }} 
                                    />
                                    <Recharts.Bar dataKey="orders" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                                </Recharts.BarChart>
                            </Recharts.ResponsiveContainer>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

// --- Main Export with Authenticator Wrapper ---
// This is the component that your main.tsx file imports. It handles the
// entire sign-in and sign-up UI flow.
export default function AuthenticatedApp() {
  return (
    <Authenticator>
      <App />
    </Authenticator>
  );
}

