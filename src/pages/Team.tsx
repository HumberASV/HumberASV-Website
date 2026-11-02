// src\pages\Team.tsx
import TeamRoster from "../components/team/TeamRoster";
import { currentTeam } from "../data/team";

/** The current team: the year marked Current in data/team-members.xlsx. */
const Team = () => <TeamRoster team={currentTeam} />;

export default Team;
