{
	// {
	// 	const form = document.getElementById('message-form');
	// const input = document.getElementById('message-input');
	// 	const messages = document.getElementById('messages');

	// 	form.addEventListener('submit', function (e) {
	// 		e.preventDefault();

	// 		const text = input.value.trim();
	// 		if (text === '') return;
	// 		sendMessage(text);
	// 		input.value = '';
	// 		messages.scrollTop = messages.scrollHeight;
	// 	});
	// 	input.addEventListener('input', () => {
	// 		input.style.height = 'auto'; // сброс текущей высоты
	// 		// messages.style.height = messages.scrollHeight - input.scrollHeight + 'px';
	// 		input.style.height = input.scrollHeight + 'px';
	// 	});
	// input.addEventListener('keydown', function (e) {
	// 	if (e.key === 'Enter' && !e.shiftKey) {
	// 		e.preventDefault();
	// 		const text = input.value.trim();
	// 		if (text === '') return;
	// 		initChat();
	// 		input.value = '';
	// 		messages.scrollTop = messages.scrollHeight;
	// 	}
	// });

	// 	function sendMessage(text) {
	// 		const messageContainer = document.createElement('div');
	// 		const messageElement = document.createElement('div');
	// 		const messageTime = document.createElement('time');
	// 		const messageAuthor = document.createElement('div');
	// 		const messageOptions = document.createElement('div');
	// 		const messageTop = document.createElement('div');

	// const now = new Date();
	// const hours = now.getHours().toString().padStart(2, '0');
	// const minutes = now.getMinutes().toString().padStart(2, '0');
	// const timeString = `${hours}:${minutes}`;

	// 		messageContainer.classList.add('message-container');
	// 		messageElement.classList.add('message');
	// 		messageTime.classList.add('message-time');
	// 		messageAuthor.classList.add('message-author');
	// 		messageOptions.classList.add('message-options');
	// 		messageTop.classList.add('message-top');

	// 		messageElement.textContent = text;

	// 		// messageOptions.textContent = 'fff';

	// 		messageTime.textContent = timeString;
	// 		messageAuthor.textContent = 'you';

	// 		input.style.height = 'auto';

	// 		messages.prepend(messageContainer);
	// 		messageContainer.appendChild(messageElement);
	// 		messageTop.appendChild(messageAuthor);
	// 		messageTop.appendChild(messageOptions);

	// 		messageContainer.prepend(messageTop);
	// 		messageContainer.appendChild(messageTime);
	// 		// messageContainer.prepend(messageOptions);
	// 	}
	// }

	const container = document.querySelector('.messages');

	function renderMessages(messages) {
		container.innerHTML = '';

		for (const message of messages) {
			const timeString = new Date(message.timestamp).toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			});
			const messageElement = document.createElement('article');
			messageElement.className = 'message-container';
			messageElement.innerHTML = `
        <div class="message-top">
          <div class="message-author">${message.username}</div>
          <button class="message-options"></button>
        </div>
        <p class="message">${message.text}</p>
        <time class="message-time">${timeString}</time>
      `;

			container.prepend(messageElement);
		}
	}

	function getMessages() {
		fetch('http://localhost:4000/messages', {
			method: 'GET',
		})
			.then(function (messagesResponse) {
				if (messagesResponse.status !== 200) {
					throw new Error("Couldn't get messages from server");
				}

				return messagesResponse.json();
			})
			.then(function (messagesList) {
				console.log(messagesList);
				renderMessages(messagesList);
			});
	}

	function initForm() {
		const formContainer = document.querySelector('form');

		const formTextField = formContainer.querySelector('textarea');
		const formSubmitButton = formContainer.querySelector('button');

		formContainer.onsubmit = function (evt) {
			evt.preventDefault();
			const formData = new FormData(evt.target);

			const messageData = {
				username: formData.get('username'),
				text: formData.get('text'),
			};

			formTextField.disabled = true;
			formSubmitButton.disabled = true;
			formSubmitButton.textContent = 'Сообщение отправляется...';

			fetch('http://localhost:4000/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(messageData),
			}).then(function (newMessageResponse) {
				console.log(newMessageResponse.status);

				if (newMessageResponse.status !== 200) {
					//
				}

				formTextField.disabled = false;
				formTextField.value = '';
				formSubmitButton.disabled = false;
				formSubmitButton.textContent = 'Отправить';

				getMessages();
			});
		};
	}

	function initChat() {
		getMessages();
		initForm();
	}

	initChat();
}
