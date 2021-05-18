import React, { useEffect } from 'react';
import moment from 'moment';
import socketIOClient from 'socket.io-client';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Alert from '@material-ui/lab/Alert';
import SendIcon from '@material-ui/icons/Send';
import SaveIcon from '@material-ui/icons/Save';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import useStates from "../../states";
import config from "../../configs";
import { BorderAllRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  paper: {
    padding: 10
  },
  senderMessageContainer: {
    display: "flex",
    justifyContent: "flex-end",
    margin: 5,
  },
  senderMessage: {
    display: "inline-block",
    padding: 10,
    backgroundColor: theme.palette.success.light,
    borderRadius: 5
  },
  receiverMessageContainer: {
    display: "flex",
    justifyContent: "flex-start",
    margin: 5,
  },
  receiverMessage: {
    display: "inline-block",
    padding: 10,
    backgroundColor: theme.palette.action.selected,
    borderRadius: 5
  },
  overline: {
    lineHeight: 2,
    fontSize: "9px"
  },
}));

export const PageComponent = () => {
  const classes = useStyles();
  const [state, actions] = useStates();
  const socket = socketIOClient(config.api, { autoConnect: false });

  const handleChange = name => event => {
    actions.handleInputChange(name, event);
  };

  const onUserSubmit = () => {
    actions.setStateObject({
      registeredUser: state.newUser.toUpperCase(),
    });
  };

  const onMessageSubmit = () => {
    socket.connect();
    console.log(`User: ${state.registeredUser} -> Message: ${state.newMessage}`);

    socket.emit(config.socket, { 
      user: state.registeredUser, 
      msg: state.newMessage,
      timestamp: moment(),
    });
    actions.setStateObject({
      newMessage: "",
    });
  };

  useEffect(() => {
    actions.setStateObject({
      newMessage: "",
      newUser: "",
      registeredUser: null,
      allMessages: null,
    });

    socket.connect();
    socket.on(config.socket, (msg) => {
      console.log("This Message: ", msg);
      actions.setStateObject({
        allMessages: msg,
      });
    });
    return () => socket.disconnect();
  }, []);

  return (
    <React.Fragment>
      <Container fixed>
        <Grid container spacing={1} justify="center">
          <Grid item xs={12}>
            <Paper variant="outlined" className={classes.paper} style={{ display: (state.allMessages && state.allMessages.length > 0 ? "block" : "none"), marginTop: "15px" }}>
              {/* <div className={classes.receiverMessageContainer}>
                <div className={classes.receiverMessage}>
                  <Typography variant="overline" display="block">
                    user1
                  </Typography>
                  <Typography variant="body1">
                    What's your name?
                  </Typography>
                </div>
              </div> */}
              {state.allMessages && state.allMessages.map((data, key) => (
                <div key={key} className={data.user == state.registeredUser ? classes.senderMessageContainer : classes.receiverMessageContainer}>
                  <div className={data.user == state.registeredUser ? classes.senderMessage : classes.receiverMessage}>
                    {data.user != state.registeredUser && (
                      <Typography variant="overline" display="block" className={classes.overline}>
                        {data.user}
                      </Typography>
                    )}
                    <Typography variant="body1">
                      {data.msg}
                    </Typography>                    
                  </div>
                </div>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} style={{display: (state.registeredUser ? "none" : "block")}}>
            <TextField
              margin="dense"
              id="user"
              label="Enter your username before start to chat..."
              fullWidth
              variant="outlined"
              value={state.newUser}
              onChange={handleChange('newUser')}              
              onKeyPress={event => {
                if(event.key == "Enter") {
                  onUserSubmit();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="submit user"
                      onClick={onUserSubmit}
                    >
                      <SaveIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} style={{display: (state.registeredUser ? "block" : "none")}}>
            <Typography variant="subtitle2">
              Congratulations you've join the chat with <b>{state.registeredUser}</b> as your username.
            </Typography>
            <TextField
              margin="dense"
              id="message"
              label="Enter your text..."
              fullWidth
              variant="outlined"
              value={state.newMessage}
              onChange={handleChange('newMessage')}
              onKeyPress={event => {
                if(event.key == "Enter") {
                  onMessageSubmit();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="send message"
                      onClick={onMessageSubmit}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default PageComponent;
