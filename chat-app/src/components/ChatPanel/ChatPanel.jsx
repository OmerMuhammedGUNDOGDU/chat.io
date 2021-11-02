import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";
import { useFirebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";
import {
    Header,
    Segment,
    Comment,
    Icon,
    Input,
    Form,
    Button,
} from "semantic-ui-react";
import Message from "./Message";

const { uuid } = require("uuidv4");

const ChatPanel = ({ currentChannel }) => {

    useFirebaseConnect([
        {
            path: `/messages/${currentChannel.key}`,
            storeAs: "channelMessages",
        },
    ]);

    const firebase = useFirebase();
    const currentUserUid = useSelector((state) => state.firebase.auth.uid);
    const profile = useSelector((state) => state.firebase.profile);
    const channelMessages = useSelector((state) => state.firebase.ordered.channelMessages);

    const [content, setContent] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const fileInputRef = useRef(null);
    const messsagesEndRef = useRef(null);

    useEffect(() => {
        messsagesEndRef.current.scrollIntoView({
            behaviour: "smooth",
            block: "end",
        });
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        if (content !== "") {
            const message = {
                content,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: {
                    id: currentUserUid,
                    name: profile.name,
                    avatar: profile.avatar,
                },
            };

            // Send a message
            firebase.push(`messages/${currentChannel.key}`, message).then(() => {
                setContent("");
            })
        }
    }

    const uploadMedia = (event) => {
        const file = event.target.files[0];

        // console.log(file);

        if (file) {
            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(`chat/public/${uuid()}.jpg`);

            return fileRef.put(file)
                .then((snap) => {
                    fileRef.getDownloadURL().then((downloadURL) => {
                        sendMediaMessage(downloadURL);
                    })
                })
                .catch((err) => {
                    console.err("error uploadin file", err);
                })
        }
    }

    const sendMediaMessage = url => {
        const message = {
            image: url,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: currentUserUid,
                name: profile.name,
                avatar: profile.avatar,
            },
        };

        firebase.push(`messages/${currentChannel.key}`, message).then(() => {
            console.log("Media message sent");
        })
    }

    const filterMessages = () => {
        const regex = new RegExp(searchTerm, "gi");

        const searchResults = [...channelMessages].reduce((acc, message) => {
            if (
                (message.value.content && message.value.content.match(regex)) ||
                message.value.user.name.match(regex)
            ) {
                acc.push(message);
            }

            return acc;
        }, []);

        return searchResults;
    };

    const renderedMessages = searchTerm !== "" ? filterMessages() : channelMessages;

    return (
        <>
            {/* Messages Header */}
            <Segment clearing>
                <Header as="h3" floated="left">
                    <span>
                        <Icon name="hashtag" />
                        {currentChannel.name}
                    </span>
                </Header>

                {/* Search Messages */}
                <Header as="h3" floated="right">
                    <Input
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Mesajlarda ara..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </Header>
            </Segment>

            {/* Messages */}

            <Segment
                style={{
                    position: "fixed",
                    top: 55,
                    bottom: 70,
                    width: "81%"
                }}
            >
                <Comment.Group
                    style={{
                        height: "80vh",
                        overflowY: "auto", // msjlar artmaya başladığı zaman otomatik olarak scrollbar eklemesini istedik.
                        maxWidth: "100"
                    }}
                >
                    {/* Gelen Mesajları Listeledik */}
                    {renderedMessages && renderedMessages.map(({ key, value }) => (
                        <Message key={key} message={value} />
                    ))}

                    <div ref={messsagesEndRef} />

                </Comment.Group>
            </Segment>

            {/* Sen New Messager  */}

            <Segment
                style={{
                    position: "fixed",
                    bottom: 0,
                    width: "85%",
                    display: "flex",
                }}
            >

                <Button icon onClick={() => fileInputRef.current.click()}>
                    <Icon name="add" />
                    <input type="file" name="file" ref={fileInputRef} onChange={uploadMedia} />
                </Button>

                <Form onSubmit={handleSubmit} style={{ flex: "1" }}> {/* flex: "1" ile mesaj yazma kutusunu genişletebildiğin kadar genişlet dedik!  */}
                    <Input
                        fluid
                        name="message"
                        value={content}
                        onChange={event => setContent(event.target.value)}
                        labelPosition="left"
                        placeholder={`# ${currentChannel?.name} kanalına mesaj gönder`}
                    />
                </Form>

            </Segment>

        </>
    );
};

export default ChatPanel;
