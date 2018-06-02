import VKAuth from './Auth'
import filterFriends from './filterFriends'
import FriendListDrag from './friendListsDrag'

class App extends VKAuth {
    constructor(param) {
        super(param);
        let {initApp} = param;
        this.initApp = document.querySelector('#init-app');
        this.allFriends = {};
        this.chosenFriends = {};
        this.wrapper = document.querySelector('.wrapper');
        this.app = document.querySelector(".App");
        this.saveBtn = document.querySelector('#btn_save');
        this.closeBtn = document.querySelector('#btn-close');
        this.templateAllFriends = document.querySelector('#allFriends').textContent;
        this.templateChosenFriends = document.querySelector('#chosenFriends').textContent;
        this.allFriendsResult = document.querySelector('#allFriends-result');
        this.chosenFriendResult = document.querySelector('#chosenFriends-result');
        this.chosenFriendsSearch = document.querySelector('#choosenfriends-search');
        this.allFriendsSearch = document.querySelector('#allfriends-search');
        this.startApp = this.startApp.bind(this);
        this.popup = document.querySelector('.popup');
        this.closeApp = this.closeApp.bind(this);
        this.saveData = this.saveData.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.initListener();
        filterFriends([{
            target: this.allFriendsSearch,
            result: this.allFriendsResult
        }, {
            target: this.chosenFriendsSearch,
            result: this.chosenFriendResult
        }]);
        new FriendListDrag({
            container: document.querySelector('.friends-lists'),
            target: {
                class: 'friends-list__item',
                container: 'friend-list',
            }
        });
    }

    initListener() {
        this.initApp.addEventListener('click', this.startApp)
        this.saveBtn.addEventListener('click', this.saveData);
        this.closeBtn.addEventListener('click', this.closeApp);
        this.popup.addEventListener('click', this.closePopup)
    }

    showApp() {
        this.wrapper.classList.add('overlay');
        this.app.classList.remove('hidden');
        this.initApp.classList.add('hidden');
    }

    async startApp(e) {
        e.preventDefault();
        if (localStorage.getItem('myFriends')) {
            let {allFriends, chosenFriends} = JSON.parse(localStorage.getItem('myFriends'));
            this.allFriends = allFriends;
            this.chosenFriends = chosenFriends;
            this.showApp();
            this.renderFriends();
        } else {
            try {
                await this.auth();
                this.allFriends = await this.callApi('friends.get', {fields: 'photo_100'});
                this.showApp();
                this.renderFriends();

            } catch (e) {
                console.log(e.message)
            }
        }
    }

    renderFriends() {
        const renderAllFriends = Handlebars.compile(this.templateAllFriends);
        const renderChosenFriends = Handlebars.compile(this.templateChosenFriends);
        const allFriendsHtml = renderAllFriends(this.allFriends);
        const chosenFriendsHtml = renderChosenFriends(this.chosenFriends);

        this.allFriendsResult.innerHTML = allFriendsHtml;
        this.chosenFriendResult.innerHTML = chosenFriendsHtml
    }

    saveData() {
        let allFriends, chosenFriends;

        allFriends = this.composeFriends(this.allFriendsResult);
        chosenFriends = this.composeFriends(this.chosenFriendResult);
        localStorage.setItem('myFriends', JSON.stringify({allFriends, chosenFriends}));
        this.popup.classList.remove('hidden');
    }

    composeFriends(list) {
        let arr = [];

        for (let child of list.children) {
            let [firstName, lastName] = child.querySelector('.friends-list__name').innerText.split(' ');
            let photo100 = child.querySelector('.friends-lists__picture').getAttribute('src');

            arr.push({
                first_name: firstName, last_name: lastName, photo_100: photo100
            })
        }

        return {
            items: arr
        }
    }

    closeApp() {
        this.wrapper.classList.remove('overlay');
        this.app.classList.add('hidden');
        this.initApp.classList.remove('hidden');
    }

    closePopup(e) {
        if (e.target.tagName === 'DIV' || 'BUTTON') {
            this.popup.classList.add('hidden');
            this.closeApp()
        }
    }
}

export default (param) => {
    new App(param)
}