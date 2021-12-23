import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, } from 'reactstrap';
import StandardCardBody from "../core/standardCardBody";
import UsersTable from "../core/usersTable";
import TeamsTable from "../core/teamsTable";

const { getAllPlayersInSession } = require('../../services/player');
const { getActiveGameBySession } = require('../../services/game');



const User = () => {
  const [players, setPlayers] = useState([]);
  const [activeGame, setActiveGame] = useState({});
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchActiveGame = async () => {
      const game = await getActiveGameBySession('-Mr5Za45mfPrw35CtnGm');
      setActiveGame(game);
      const teamArrs = Object.values(game.teams);
      setTeams(...teams, teamArrs)
    }

    const fetchPlayers = async () => {
      const playersInSession = await getAllPlayersInSession('-Mr5Za45mfPrw35CtnGm');
      setPlayers(...players, playersInSession);
    };

    fetchActiveGame();
    fetchPlayers();
  }, []);

  return (
    <Container>
      <Row xs="2">
        <Col>
          <Card>
            <StandardCardBody title="Players in Session">
              <UsersTable players={players} />
            </StandardCardBody>
          </Card>
        </Col>

        <Col>
          <Card>
            <StandardCardBody title="Active game">
              {
                teams.map((team, index) => <TeamsTable players={team} index={index+1} key={index+1} />)
              }
            </StandardCardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
};

export default User;