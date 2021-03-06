import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import AppMenuBar from '../App-Menu-Bar/App-Menu-Bar';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ReactJson from 'react-json-view'
import { PosName } from '../../models/pos-name';
import { Typography, FormControl, InputLabel, FilledInput, Avatar, Chip } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import { purple } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1, 3),
      borderRadius: '5px',
    },
    formControl: {
      marginTop: '5px',
      width: '100%',
    },
    filledInput: {
      textAlign: 'center',
      color: 'secondary',
    },
    posChips: {
      margin: theme.spacing(1),
      color: 'black',
    },
    annotatorChips: {
      marginRight: '5px',
      marginBottom: '5px',
    },
    progress: {
      position: "absolute",
      color: purple[200],
      margin: theme.spacing(2),
      marginTop: '18px',
      height: '30px !important',
      width: '30px !important',
    }
  }),
);

const App: React.FC = () => {
  const [text, setText] = useState('Type a sentence here to begin!');
  const [tags, setTags] = useState<Array<any>>([]);
  const [tagSet, setTagSet] = useState<Set<string>>(new Set<string>());
  const [names, setNames] = useState<Array<PosName>>([]);
  const [hoveredToken, setHoveredToken] = useState<string>('');
  const [annotators, setAnnotators] = useState<Map<string, boolean>>(new Map<string, boolean>(Object.entries({
    'tokenize': true,
    'ssplit': true,
    'truecase': true,
    'pos': true,
    'lemma': true,
    'ner': true,
    'depparse': true,
  })));
  const classes = useStyles();
  const urlBase = 'http://0.0.0.0:3001/v1';

  const toggleAnnotator = (annotator: string) => {
    annotators.set(annotator, !annotators.get(annotator));
    setAnnotators(new Map<string, boolean>(annotators.entries()));
  }

  useEffect(() => {
    axios
      .get(`${urlBase}/pos/names`)
      .then((result) => {
        setNames(result.data)}
      );
  }, []);

  useEffect(() => {
    const annotatorsQuery: string = Array.from(annotators.entries()).filter(([,isOn]) => isOn).map(([key,]) => key).join(',');
    axios
      .post(`${urlBase}/pos/tag?annotators=${annotatorsQuery}`, text, { headers: { 'Content-Type': 'text/plain' } })
      .then(result => {
        setTags(result.data);
        if (result.data.sentences) {
          setTagSet(new Set<string>(result.data.sentences.map((sentence: any) => sentence.tokens.map((token: any) => token.pos)).flat()));
        } else {
          setTagSet(new Set<string>(result.data.tokens.map((token: any) => token.pos)));
        }
      });
  }, [text, annotators]);

  const taggedPos: Set<string> = new Set<string>();

  return (
    <div className="App">
      <AppMenuBar />
      <div className="grid-container">
        <div className="grid-item">
          <Paper className={classes.paper}>
            <Typography variant="h4" component="h1" style={{paddingTop: '15px', paddingBottom: '15px'}}>Annotator Input</Typography>
              {Array.from(annotators.entries()).map(([annotator]) => (
                <Chip clickable
                  label={annotator}
                  style={{ backgroundColor: annotators.get(annotator) ? purple[200]: 'dimgrey'}}
                  className={classes.annotatorChips}
                  deleteIcon={annotators.get(annotator) ? <DoneIcon /> : <ClearIcon />}
                  onClick={() => toggleAnnotator(annotator)}
                  onDelete={() => toggleAnnotator(annotator)}
                  />
              ))}
              <FormControl className={classes.formControl} variant="filled">
                <InputLabel htmlFor="component-filled">
                  Type a sentence here to begin!
                </InputLabel>
                <FilledInput multiline
                  id="component-filled"
                  rows={24}
                  rowsMax={42}
                  className={classes.filledInput}
                  onChange={(event: any) => { console.log(event); return setText(event.target.value.trim()) }}
                  />
              </FormControl>
            </Paper>
        </div>
        <div className="grid-item">
          <Paper className={classes.paper} style={{backgroundColor: '#1E1E1E'}}>
            <Typography variant="h4" component="h1" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
              Parts of Speech {!(
                annotators.get('ner') ||
                annotators.get('lemma') ||
                annotators.get('depparse') ||
                annotators.get('pos')
              ) ? <small style={{ color: '#FF6F61', opacity: 0.5}}>(disabled)</small> : ''}
            </Typography>
            {names.map((name, i) => (
              <Chip
                avatar={<Avatar>{name.token}</Avatar>}
                size="small"
                label={name.description}
                style={{
                  backgroundColor: `hsl(${360 * i / names.length},100%,82%)`,
                  opacity: tagSet.has(name.token) || hoveredToken === name.token ? 1 : 0.3,
                }}
                className={classes.posChips}
                onMouseEnter={() => setHoveredToken(name.token)}
                onMouseLeave={() => setHoveredToken('')}
                />
            ))}
          </Paper>
        </div>
        <div className="grid-item">
          <Paper className={classes.paper} style={{ backgroundColor: '#1E1E1E' }}>
            <Typography variant="h4" component="h1" style={{ paddingTop: '15px', paddingBottom: '15px', display: 'inline-block' }}>
              Text Annotations
            </Typography>
            {/* {1 > 0 ? <CircularProgress  className={classes.progress} /> : ''} */}
            <ReactJson
              src={tags}
              theme='twilight'
              iconStyle='triangle'
              displayDataTypes={false}
              displayObjectSize={false}
              indentWidth={4}
              enableClipboard={false}
              collapsed={5}
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
