import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useElectionContract } from './useElection';

export default function ElectionComponent() {
    const { login, ready, authenticated } = usePrivy();
    const { addCandidate, vote, getWinner } = useElectionContract();

    const [candidateName, setCandidateName] = useState('');
    const [candidateIndex, setCandidateIndex] = useState('');
    const [winner, setWinner] = useState('');

    const disableLogin = !ready || (ready && authenticated);

    const handleAddCandidate = async (e: any) => {
        e.preventDefault();
        await addCandidate(candidateName);
        setCandidateName('');
    };

    const handleVote = async (e: any) => {
        e.preventDefault();
        await vote(parseInt(candidateIndex));
        setCandidateIndex('');
    };

    const handleGetWinner = async () => {
        const winnerName = await getWinner();
        setWinner(winnerName);
    };

    return (
        <div>
            <h1>Election</h1>
            <button disabled={disableLogin} onClick={login}>
                Log in
            </button>

            <form onSubmit={handleAddCandidate}>
                <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Candidate Name"
                />
                <button type="submit">Add Candidate</button>
            </form>

            <form onSubmit={handleVote}>
                <input
                    type="number"
                    value={candidateIndex}
                    onChange={(e) => setCandidateIndex(e.target.value)}
                    placeholder="Candidate Index"
                />
                <button type="submit">Vote</button>
            </form>

            <button onClick={handleGetWinner}>Get Winner</button>
            {winner && <p>The winner is: {winner}</p>}
        </div>
    );
}