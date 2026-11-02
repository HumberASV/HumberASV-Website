// src\pages\TeamYear.tsx
import { Navigate, useParams } from "react-router-dom";
import TeamRoster from "../components/team/TeamRoster";
import { currentYear, getTeamYear } from "../data/team";

/** An archived team at /team/:year, in the same layout as the current Team page. */
const TeamYear = () => {
  const { year } = useParams();
  const team = getTeamYear(Number(year));

  if (!team) return <Navigate to="/team/past" replace />;

  // Keyed by year so switching years resets the roster's image-loading state.
  return <TeamRoster key={team.year} team={team} archived={team.year !== currentYear} />;
};

export default TeamYear;
