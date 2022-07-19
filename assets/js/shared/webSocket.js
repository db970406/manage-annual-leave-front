import { makeElementTag, makeIconTag, makeInputTag } from './makeHtmlTag.js';
import { timworxUrl, wsTimworxUrl } from './requestUrl.js';
import { alarm } from './alert.js';
const HR_MANAGER_ID = 891274;
const webSocket = new WebSocket(wsTimworxUrl);

const getRoomInfo = async () => {
    const savedEmployeeId = localStorage.getItem("employeeId");

    const data = await fetch(`${timworxUrl}/message/rooms/employee/${savedEmployeeId}`);
    if (data.status === 200) {
        const { roomData } = await data.json();
        localStorage.setItem("roomId", roomData.roomId);
        webSocket.send(JSON.stringify({ roomId: roomData.roomId }));

        const controllMessageButton = document.getElementById("controll_message_button");
        const countMessageContainer = makeElementTag({
            element: "div",
            id: "count_message_container"
        });

        const countMessage = makeElementTag({
            element: "p",
            id: "count_message",
            textContent: roomData.unreadcount
        });
        if (+roomData.unreadcount === 0) {
            countMessageContainer.classList.add("hidden");
        }
        countMessageContainer.appendChild(countMessage);
        controllMessageButton.appendChild(countMessageContainer);

    } else {
        alarm("존재하지 않는 직원의 아이디입니다.");
        const okButton = document.getElementById("ok_button")
        localStorage.removeItem("employeeId");
        getIdForm();
        okButton.focus();
    }
}

export const controllMessage = () => {
    const controllMessageButton = makeElementTag({
        element: "button",
        id: "controll_message_button"
    });
    const openMessageIcon = makeIconTag({
        iconName: "fas fa-paper-plane"
    });
    controllMessageButton.appendChild(openMessageIcon);

    controllMessageButton.addEventListener("click", openMessage);
    return controllMessageButton;
}

const openMessage = async () => {
    await messageComponent();

    const controllMessageButton = document.getElementById("controll_message_button");
    controllMessageButton.removeEventListener("click", openMessage);
    controllMessageButton.addEventListener("click", closeMessage);
}

const closeMessage = () => {
    const messageContainer = document.getElementById("message_container");
    if (messageContainer) messageContainer.remove();
    const controllMessageButton = document.getElementById("controll_message_button");
    controllMessageButton.removeEventListener("click", closeMessage);
    controllMessageButton.addEventListener("click", openMessage);
}

const getRoom = async (senderId) => {

    const data = await fetch(`${timworxUrl}/message/rooms/${senderId}`);
    if (data.status === 200) {
        const { messagesData, roomId, employeeId } = await data.json();

        const savedEmployeeId = localStorage.getItem("employeeId");
        const readResponse = await fetch(`${timworxUrl}/message/read`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                roomId,
                employeeId: savedEmployeeId
            })
        });
        if (readResponse.status === 200) {
            const { unreadcount } = await readResponse.json();
            const countMessageContainer = document.getElementById("count_message_container");
            const countMessage = countMessageContainer.querySelector("#count_message");

            if (+unreadcount === 0) {
                countMessageContainer.classList.add("hidden");
                countMessage.textContent = 0;
            } else {
                countMessage.textContent = +countMessage.textContent - unreadcount;
                countMessageContainer.classList.remove("hidden");
            }

        }

        const messageHeader = document.getElementById("message_header");
        const messageSection = document.getElementById("message_section");
        messageSection.remove();

        document.addEventListener("keydown", (event) => closeMessageByESC(event));

        const newMessageSection = makeElementTag({
            element: "section",
            id: "message_section",
            className: "dialogue"
        });
        newMessageSection.dataset.room_id = roomId;
        newMessageSection.dataset.employee_id = employeeId;

        if (messagesData) {
            messagesData.forEach(messageInfo => {
                const { employee_id, employee_name, message } = messageInfo;
                const messageBox = makeElementTag({
                    element: "div",
                    id: "message_box",
                    className: +savedEmployeeId === +employee_id ? "mine" : "not_mine"
                });
                const messageOwner = makeElementTag({
                    element: "p",
                    id: "message_owner",
                    textContent: employee_name
                });

                const messageParagraph = makeElementTag({
                    element: "p",
                    id: "message_paragraph",
                    textContent: message
                });

                messageBox.append(messageOwner, messageParagraph);
                newMessageSection.appendChild(messageBox);
            });
        }

        const messageHeaderName = document.getElementById("message_header_name");
        const messageForm = document.getElementById("message_form");
        if (messageHeaderName) messageHeaderName.textContent = "대화중입니다...";

        const messageInput = makeInputTag({
            placeholder: "메세지를 입력하세요",
            id: "message_input",
            name: "message_input"
        });
        messageInput.maxLength = 30;
        const messageSubmitButton = makeElementTag({
            element: "button",
            id: "message_submit_button"
        });
        const messageSubmitIcon = makeIconTag({
            iconName: "fas fa-paper-plane"
        });
        messageSubmitButton.appendChild(messageSubmitIcon);

        // 제출된 input value를 서버로 보낸다.
        const handleSubmit = async (event) => {
            event.preventDefault();
            const messageInput = document.getElementById("message_input");

            const receivedMessage = messageInput.value;
            if (!receivedMessage) return;

            const data = await fetch(`${timworxUrl}/message/create`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    managerId: +savedEmployeeId === HR_MANAGER_ID ? HR_MANAGER_ID : null,
                    employeeId: +savedEmployeeId === HR_MANAGER_ID ? employeeId : savedEmployeeId,
                    receivedMessage,
                })
            });
            if (data.status === 201) {
                const { messageData: { employee_name, room_id } } = await data.json();
                webSocket.send(JSON.stringify({
                    roomId: room_id,
                    employeeId: savedEmployeeId,
                    employeeName: employee_name,
                    receivedMessage,
                }));

                messageInput.value = "";
            }
        };

        messageForm.append(messageInput, messageSubmitButton);
        messageForm.addEventListener("submit", handleSubmit);
        messageHeader.insertAdjacentElement("afterend", newMessageSection);
        newMessageSection.scrollTo(0, newMessageSection.scrollHeight);
    }
}

const closeMessageByESC = (event) => {
    if (event.keyCode == 27) closeMessage(webSocket);
}

export const messageComponent = async () => {
    const messageContainer = makeElementTag({
        element: "div",
        id: "message_container",
        className: "glass"
    });
    const messageHeader = makeElementTag({
        element: "header",
        id: "message_header"
    });
    const messageHeaderName = makeElementTag({
        element: "h3",
        id: "message_header_name",
    });
    messageHeader.appendChild(messageHeaderName);

    const messageSection = makeElementTag({
        element: "section",
        id: "message_section",
        className: "dialogue"
    });
    const messageForm = makeElementTag({
        element: "form",
        id: "message_form"
    });

    const savedEmployeeId = localStorage.getItem("employeeId");

    messageContainer.append(messageHeader, messageSection, messageForm);
    document.body.appendChild(messageContainer);

    if (+savedEmployeeId === HR_MANAGER_ID) {
        const data = await fetch(`${timworxUrl}/message/rooms`);
        if (data.status === 200) {
            const { roomsData } = await data.json();

            messageHeaderName.textContent = "대화 리스트";
            messageSection.classList.add("list");

            roomsData.forEach(room => {
                const enterRoomBox = makeElementTag({
                    element: "div",
                    id: "enter_room_box"
                });
                enterRoomBox.dataset.room_id = room.room_id;
                enterRoomBox.dataset.employee_id = room.employee_id;
                const counterPart = makeElementTag({
                    element: "h4",
                    id: "counter_part",
                    textContent: room.employee_name
                });
                enterRoomBox.appendChild(counterPart);

                if (+room.unreadcount > 0) {
                    const newMessageSign = makeElementTag({
                        element: "div",
                        id: "new_message_sign",
                    });
                    const unreadMessageIcon = makeIconTag({
                        iconName: "fas fa-envelope"
                    });
                    newMessageSign.appendChild(unreadMessageIcon);
                    enterRoomBox.appendChild(newMessageSign);
                }

                enterRoomBox.addEventListener("click", () => getRoom(room.employee_id));
                messageSection.appendChild(enterRoomBox);
            });

            document.addEventListener("keydown", (event) => {
                if (event.keyCode == 27) messageContainer.remove();
            });
        }
    } else {
        getRoom(savedEmployeeId);
    }
}

const runWebSocket = () => {
    webSocket.addEventListener("open", () => {
        console.log("브라우저가 웹소켓 연결을 감지했습니다!");
    });
    webSocket.addEventListener("close", () => {
        console.log("브라우저와 웹소켓 연결이 닫혔습니다!");
    });

    const audioAlarm = document.createElement("audio");
    audioAlarm.src = "/assets/audio/alarm.mp3";

    // 서버로부터 다시 받은 메세지
    webSocket.addEventListener("message", (message) => {
        const savedEmployeeId = localStorage.getItem("employeeId");
        const messageSection = document.getElementById("message_section");
        let isEmployeeListMode = false;
        if (messageSection) isEmployeeListMode = messageSection.classList.contains("list");

        const { employeeId, employeeName, receivedMessage } = JSON.parse(message.data);
        if (!messageSection || isEmployeeListMode) {
            audioAlarm.play();
            const countMessageContainer = document.getElementById("count_message_container");
            countMessageContainer.classList.remove("hidden");
            const countMessage = document.getElementById("count_message");
            countMessage.textContent = +countMessage.textContent + 1 || 1;
        } else {
            if (receivedMessage) {
                const messageBox = makeElementTag({
                    element: "div",
                    id: "message_box",
                    className: +savedEmployeeId === +employeeId ? "mine" : "not_mine"
                });
                const messageOwner = makeElementTag({
                    element: "p",
                    id: "message_owner",
                    textContent: employeeName
                });

                const messageParagraph = makeElementTag({
                    element: "p",
                    id: "message_paragraph",
                    textContent: receivedMessage
                });

                messageBox.append(messageOwner, messageParagraph);
                messageSection.appendChild(messageBox);
                messageSection.scrollTo(0, messageSection.scrollHeight);
            }
        }
    });
}

const getIdForm = () => {
    const savedEmployeeId = localStorage.getItem("employeeId");
    if (!savedEmployeeId) {
        alarm();
        const idInput = makeInputTag({
            id: "id_input",
            placeholder: "임시 ID를 입력해주세요",
            required: true
        });
        const notionLink = makeElementTag({
            id: "notion_link",
            element: "a",
            textContent: "임시 ID 확인"
        });
        notionLink.target = "_blank";
        notionLink.href = "https://sj-openlink.notion.site/2-14505a22aa784143aab9eba1986ab7ac";
        const warningButtonsBox = document.getElementById("warning_buttons_box");
        const okButton = document.getElementById("ok_button");

        warningButtonsBox.insertAdjacentElement('beforebegin', notionLink);
        warningButtonsBox.insertAdjacentElement('beforebegin', idInput);

        okButton.addEventListener("click", () => {
            if (isNaN(idInput.value) || idInput.value <= 0 || !idInput.value) {
                return getIdForm();
            }
            localStorage.setItem("employeeId", idInput.value);
            getRoomInfo();
        });
    } else {
        getRoomInfo();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    getIdForm();
    runWebSocket();
})