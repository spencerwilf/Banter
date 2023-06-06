import React from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingIcon from "../../LoadingPage/LoadingIcon";
import { useEffect } from "react";
import { useModal } from "../../../context/Modal";
import MessageCard from "./MessageCard";
import "./MessagesIndex.css";
import "../MessageForm/MessageForm.css";
import { useState } from "react";
import { createMessageThunk } from "../../../store/message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faUsersRectangle } from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import { deleteMessageThunk } from "../../../store/message";
import { updateMessageThunk } from "../../../store/message";
import "./MessagesIndex.css";
import AddUserToChannelModal from "./AddUserModal";
import { loadActiveWorkspace } from "../../../store/activeWorkspace";
import { getAllChannelMessagesThunk } from "../../../store/message";
import UpdateChannel from "../../Channels/UpdateChannel";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
let socket;



function MessagesIndex({ workspaceId }) {
  const { setModalContent } = useModal();
  const sessionUser = useSelector((state) => state.session.user);
  const activeChannel = useSelector((state) => state.activeChannel);
  const allChannels = useSelector((state) => state.channels);
  const allMessages = useSelector((state) => Object.values(state.messages));
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState(allMessages);
  const [editMessage, setEditMessage] = useState(null);
  const user = useSelector((state) => state.session.user);
  const {pathname} = useLocation()

  const allCurrentChannelMessages = allMessages.filter(
    (e) => activeChannel.id === e.channel_id
  );

  useEffect(() => {
    socket = io();
    socket.on("chat", (chat) => {
      // when we recieve a chat, add it into our messages array in state
      setMessages((messages) => {
        if (messages.filter((m) => m.id === chat.id).length > 0) {
          return messages;
        } else {
          return [...messages, chat];
        }
      });
    });

    socket.on("delete", (chat) => {
      setMessages((messages) => {
        return messages.filter((message) => message.id !== chat.id);
      });
    });

    socket.on("edit", (chat) => {
      setMessages((messages) => {
        let index = messages.findIndex((message) => message.id === chat.id);
        messages[index] = chat;
        return [...messages];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
   setMessages(allCurrentChannelMessages)
  }, [allCurrentChannelMessages?.length])


  useEffect(() => {
    dispatch(getAllChannelMessagesThunk(activeChannel.id))
   }, [allCurrentChannelMessages?.length])

  const handleCreate = async (e) => {
    e.preventDefault();

    if (editMessage) {
      // if editMessage is set, update the message
      const payload = {
        id: editMessage.id, // pass the id of the edited message
        content,
        channel_id: activeChannel.id,
      };
      let res = await dispatch(updateMessageThunk(payload));
      if (res) {
        if (socket) {
          socket.emit("edit", {
            // emit edit event
            id: res.id,
            user_id: user.id,
            channel_id: activeChannel.id,
            content: content,
            message_owner: {
              id: user.id,
              username: user.username,
              profile_picture: user.profile_picture,
              first_name: user.first_name,
              last_name: user.last_name,
            },
          });
        }
        setContent("");
        setEditMessage(null);
      }
    } else {
      // if editMessage is not set, create a new message
      const payload = {
        content,
        channel_id: activeChannel?.id,
      };
      let res = await dispatch(createMessageThunk(payload));
      if (res) {
        if (socket) {
          socket.emit("chat", {
            // emit chat event
            id: res.id,
            user_id: user.id,
            channel_id: activeChannel.id,
            content: content,
            message_owner: {
              id: user.id,
              username: user.username,
              profile_picture: user.profile_picture,
              first_name: user.first_name,
              last_name: user.last_name,
            },
          });
        }
        setContent("");
      }
    }
  };

  const handleDeleteMessage = async (e, message) => {
    e.preventDefault();
    if (socket) {
      await dispatch(deleteMessageThunk(message.id));
      socket.emit("delete", {
        id: message.id,
        user: user.username,
        msg: message.content,
      });
    }
  };

  const handleEditMessage = (e, message) => {
    e.preventDefault();
    setEditMessage(message);
    setContent(message.content);
  };

  if (!allCurrentChannelMessages) {
    return <LoadingIcon />;
  }

  const handleAddUserToChannel = () => {
    setModalContent(<AddUserToChannelModal />);
    dispatch(loadActiveWorkspace(workspaceId));
  };

  return (

    <>

    {pathname.includes('explore') && (
      <>
          <div className="message-dashboard-section">
  <div className="manage-channels-show-index">
  <UpdateChannel/>
        </div>
          </div>
        </>
)}
   

      {!pathname.includes('explore') && <div className="message-dashboard-section">



        {activeChannel.id && (
          <div className="current-channel-name-bar">
            <h2 className="active-channel-header-text" ># {allChannels[activeChannel.id].name}</h2>

            <FontAwesomeIcon
            onClick={handleAddUserToChannel}
            icon={faUsersRectangle}
            className="add-to-channel-user-icon"
            />

          </div>
        )}

      {/* {activeChannel.id && <MessageForm activeChannel={activeChannel} />} */}
    <div className="messages-display">
      {messages?.map((message) => (
        <MessageCard
          key={message.id}
          sessionUser={sessionUser}
          activeChannel={activeChannel}
          message={message}
          socket={socket}
          user={sessionUser}
          handleDeleteMessage={handleDeleteMessage}
          handleEditMessage={handleEditMessage}
          messages={messages}
          setMessages={setMessages}
        />
      ))}
      </div>
      {activeChannel.id && (
        <div className="create-message-form">
        <form onSubmit={handleCreate} id="form-1">
            <input
                className="create-message-input"
                type="textarea"
                placeholder="Type your message here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </form>
            <button
              className="create-message-button"
              type="submit"
              form="form-1"
            >
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="create-message-icon"
              />
            </button>
    </div>
      )}
    </div>}
    </>
  );
}

export default MessagesIndex;
