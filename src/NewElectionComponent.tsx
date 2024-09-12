import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { usePrivy } from '@privy-io/react-auth';
import { useElectionContract } from './useElection';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
} from "@/components/ui/navigation-menu";

export default function Component() {
    const { login, ready, authenticated } = usePrivy();
    const { addCandidate, vote, getWinner, getAllCandidates } = useElectionContract();

    const [candidateIndex, setCandidateIndex] = useState('');
    const [winner, setWinner] = useState('');
    const [candidates, setCandidates] = useState<string[]>([]);
    const [voteCounts, setVoteCounts] = useState<number[]>([]);

    const disableLogin = !ready || (ready && authenticated);

    useEffect(() => {
        let isMounted = true;

        async function fetchCandidates() {
            if (authenticated && isMounted) {
                const data = await getAllCandidates();
                if (data) {
                    const [names, votes] = data;
                    setCandidates(names);
                    setVoteCounts(votes);
                }
            }
        }

        fetchCandidates();

        return () => {
            isMounted = false; // Cleanup to prevent setting state after unmount
        };
    }, []);

    const handleVote = async (e: any) => {
        e.preventDefault();
        await vote(parseInt(candidateIndex));
        setCandidateIndex('');
    };

    console.log(candidates);

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-100 to-gray-200 p-4">
            <header className="mb-8">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Button
                                className="flex items-center gap-2"
                                variant={authenticated ? "outline" : "default"}
                                disabled={disableLogin} onClick={login}
                            >
                                <Wallet className="h-4 w-4" />
                                {authenticated ? "Wallet Connected" : "Login"}
                            </Button>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </header>

            <main className="flex flex-col items-center space-y-8">
                <Table>
                    <TableCaption>List of Candidates</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Id</TableHead>
                            <TableHead>Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">0</TableCell>
                                <TableCell>Candidate A</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">1</TableCell>
                                <TableCell>Candidate A</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">2</TableCell>
                                <TableCell>Candidate A</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">3</TableCell>
                                <TableCell>Candidate A</TableCell>
                            </TableRow>
                    </TableBody>
                </Table>
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Decentralized Voting</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex space-x-2">
                            <Input
                                type="text"
                                value={candidateIndex}
                                onChange={(e) => setCandidateIndex(e.target.value)}
                                placeholder="Candidate Index"
                                className="flex-grow"
                            />
                            <Button onClick={handleVote} disabled={!authenticated || !candidateIndex}>
                                Vote
                            </Button>
                        </div>
                        {!authenticated && (
                            <p className="mt-4 text-sm text-gray-500 text-center">
                                Please connect your wallet to vote.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Table to display candidates
                {candidates.length > 0 && (
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-center">Candidates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="min-w-full table-auto border-collapse border border-gray-400">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-400 px-4 py-2">Index</th>
                                        <th className="border border-gray-400 px-4 py-2">Name</th>
                                        <th className="border border-gray-400 px-4 py-2">Vote Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {candidates.map((name, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-400 px-4 py-2 text-center">{index}</td>
                                            <td className="border border-gray-400 px-4 py-2 text-center">{name}</td>
                                            <td className="border border-gray-400 px-4 py-2 text-center">{voteCounts[index]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                )} */}
            </main>
        </div>
    );
}
