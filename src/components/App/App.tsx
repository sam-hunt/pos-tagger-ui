import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import AppMenuBar from '../App-Menu-Bar/App-Menu-Bar';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ReactJson from 'react-json-view'
import { PosName } from '../../models/pos-name';
import { Typography, FormControl, InputLabel, FilledInput, Avatar, Chip } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1, 3),
      borderRadius: '5px',
    },
    formControl: {
      width: '100%',
    },
    filledInput: {
      textAlign: 'center',
      color: 'secondary',
    },
    chip: {
      margin: theme.spacing(1),
      color: 'black',
    },
  }),
);

const App: React.FC = () => {
  const [text, setText] = useState('Type a sentence here to begin!');
  const [tags, setTags] = useState<Array<any>>([]);
  const [tagSet, setTagSet] = useState<Set<string>>(new Set<string>());
  const [names, setNames] = useState<Array<PosName>>([]);
  const [hoveredToken, setHoveredToken] = useState<string>('');
  const classes = useStyles();
  const urlBase = 'http://0.0.0.0:3001/v1';

  useEffect(() => {
    axios
      .get(`${urlBase}/pos/names`)
      .then((result) => {
        setNames(result.data)}
      );
  }, []);

  useEffect(() => {
    axios
      .post(`${urlBase}/pos/tag`, text, { headers: { 'Content-Type': 'text/plain' } })
      .then(result => {
        setTags(result.data);
        setTagSet(new Set<string>(result.data.map((sentence: any) => sentence.words.map((word: any) => word.pos)).flat()));

      });
  }, [text]);

  const taggedPos: Set<string> = new Set<string>();

  return (
    <div className="App">
      <AppMenuBar />
      <div className="grid-container">
        <div className="grid-item">
          <Paper className={classes.paper}>
            <Typography variant="h4" component="h1" style={{paddingTop: '15px', paddingBottom: '15px'}}>Core NLP Annotator</Typography>
              <FormControl className={classes.formControl} variant="filled">
                <InputLabel htmlFor="component-filled">
                  Type a sentence here to begin!
                </InputLabel>
                <FilledInput multiline
                  id="component-filled"
                  rows={20}
                  rowsMax={42}
                  className={classes.filledInput}
                  onChange={(event: any) => { console.log(event); return setText(event.target.value.trim()) }}
                  />
              </FormControl>
            </Paper>
        </div>
        <div className="grid-item">
          <Paper className={classes.paper} style={{backgroundColor: '#1E1E1E'}}>
            <Typography variant="h4" component="h1" style={{ paddingTop: '15px', paddingBottom: '15px' }}>Parts of Speech</Typography>
            {names.map((name, i) => (
              <Chip
                avatar={<Avatar>{name.token}</Avatar>}
                size="small"
                label={name.description}
                style={{
                  backgroundColor: `hsl(${360 * i / names.length},100%,82%)`,
                  opacity: tagSet.has(name.token) || hoveredToken === name.token ? 1 : 0.3,
                }}
                className={classes.chip}
                onMouseEnter={() => setHoveredToken(name.token)}
                onMouseLeave={() => setHoveredToken('')}
                />
            ))}
          </Paper>
        </div>
        <div className="grid-item">
          <Paper className={classes.paper} style={{ backgroundColor: '#1E1E1E' }}>
            <Typography variant="h4" component="h1" style={{ paddingTop: '15px', paddingBottom: '15px' }}>Text Annotations</Typography>
            <ReactJson
              src={tags}
              theme='twilight'
              iconStyle='triangle'
              displayDataTypes={false}
              displayObjectSize={false}
              indentWidth={4}
              enableClipboard={false}
              collapsed={4}
              style={{paddingLeft: '20px', borderRadius: '5px'}}
              >
            </ReactJson>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default App;
