{
	const USERNAME_REC = 'username';
	const usernameContainer = document.querySelector('.username');
	let user = usernameContainer.querySelector('.username-input');
	const logOut = document.querySelector('.logout-button');

	logOut.onclick = function (e) {
		e.preventDefault();
		user.value = '';
		localStorage.clear();
		initApp();
	};

	let username = null;
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
			messageElement.classList.toggle(
				'message-mine',
				username !== message.username
			);
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

	function getMessages(cb) {
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
				renderMessages(messagesList);

				if (typeof cb === 'function') {
					cb();
				}
			});
	}

	function scrollToBottom() {
		container.scrollTop = container.scrollHeight;
	}

	function initForm() {
		const formContainer = document.querySelector('#message-form');
		const usernameField = formContainer.querySelector('input[name=username]');
		const formTextField = formContainer.querySelector('textarea');
		const formSubmitButton = formContainer.querySelector('button');
		const originalIMGbutton = formSubmitButton.innerHTML;
		usernameField.value = username;

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
					console.log('smth not okay');
				}

				formTextField.disabled = false;
				formTextField.value = '';
				formSubmitButton.disabled = false;
				formSubmitButton.innerHTML = originalIMGbutton;

				getMessages(scrollToBottom);
			});
		};
	}

	function initChat() {
		getMessages();
		setInterval(getMessages, 3000);
		initForm();
	}

	function initUsernameForm() {
		const usernameForm = usernameContainer.querySelector('form');
		console.log('aaaaaa');
		usernameForm.onsubmit = function (evt) {
			evt.preventDefault();

			const formElement = evt.target;
			const formData = new FormData(formElement);
			const enteredUsername = formData.get('username');

			localStorage.setItem(USERNAME_REC, enteredUsername);
			usernameContainer.close();
			usernameForm.onsubmit = null;

			initApp();
		};
		usernameContainer.showModal();
	}

	function initApp() {
		username = localStorage.getItem(USERNAME_REC);

		if (username === null) {
			initUsernameForm();
			return;
		}

		initChat();
	}

	initApp();
}
