import React, { useState, useMemo, useEffect } from 'react';
import { Authenticator, Button, Heading, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import * as Recharts from 'recharts';

// --- Amplify Configuration ---
// These files connect your frontend to your deployed backend
import outputs from '../amplify_outputs.json'; 
import { type Schema as BackendSchema } from '../amplify/data/resource'; 
import './styles.css'; // Optional: for custom dark-theme authenticator

Amplify.configure(outputs);
const client = generateClient<BackendSchema>();

// --- Type Alias for Clarity ---
// We create a specific TypeScript type for an Order based on your schema
type Order = BackendSchema['Order'];

// --- Main Application Component ---
function App() {
    const { signOut } = useAuthenticator();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // This effect runs once after the component mounts to fetch all orders.
    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                // Fetch all orders using the generated, type-safe client.
                const response = await client.models.Order.list();
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllOrders();

        // Set up a subscription to listen for new orders in real-time.
        const sub = client.models.Order.onCreate().subscribe(newOrder => {
            setOrders(prevOrders => [newOrder, ...prevOrders]);
        });

        // Clean up the subscription when the component unmounts.
        return () => sub.unsubscribe();
    }, []);

    // This useMemo hook processes the raw order data for the chart.
    // It only recalculates when the 'orders' state changes.
    const chartData = useMemo(() => {
        const statusCounts = orders.reduce((acc, order) => {
            const status = order.status ?? 'unknown';
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
// This ensures the Authenticator UI is rendered first.
// The App component will only render *after* a successful sign-in.
export default function AuthenticatedApp() {
  return (
    <Authenticator>
      <App />
    </Authenticator>
  );
}

