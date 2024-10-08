import { useState } from "react";
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
    const { vote, getWinner } = useElectionContract();

    const [candidateIndex, setCandidateIndex] = useState('');
    const [winner, setWinner] = useState('');

    


    const disableLogin = !ready || (ready && authenticated);

    const handleVote = async (e: React.FormEvent) => {
        e.preventDefault();
        await vote(parseInt(candidateIndex));
        setCandidateIndex('');
    };

    const handleGetWinner = async () => {
        const winnerName = await getWinner();
        setWinner(winnerName);
    };

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
                                <TableCell>Candidate B</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">2</TableCell>
                                <TableCell>Candidate C</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">3</TableCell>
                                <TableCell>Candidate D</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">4</TableCell>
                                <TableCell>Candidate E</TableCell>
                            </TableRow>
                    </TableBody>
                </Table>
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Decentralized Voting</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex space-x-2 mb-4">
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
                        <div className="flex justify-center">
                            <Button onClick={handleGetWinner} disabled={!authenticated}>
                                Get Winner
                            </Button>
                        </div>
                        {winner && (
                            <p className="mt-4 text-center font-semibold">
                                Winner: {winner}
                            </p>
                        )}
                        {!authenticated && (
                            <p className="mt-4 text-sm text-gray-500 text-center">
                                Please connect your wallet to vote or get the winner.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}