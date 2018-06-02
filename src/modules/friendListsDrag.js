import drag from './drag'

export default class FriendslistDrag extends drag {
    constructor(param) {
        super(param);
        this.init()
    }

    styleElements() {
        let button = this.state.node.querySelector('button');

        if (this.node.getAttribute('id') === 'allFriends-result') {
            button.classList.remove('btn-remove', 'btn_cross-45deg');
            button.classList.add('btn-add', 'btn_cross');
        } else {
            button.classList.remove('btn-add', 'btn_cross');
            button.classList.add('btn-remove', 'btn_cross-45deg');
        }
    }

    init() {
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-add')) {
                let item = e.target.parentNode;

                e.target.classList.remove('btn_cross', 'btn-add');
                e.target.classList.add('btn_cross-45deg', 'btn-remove');
                this.container.querySelector('#chosenFriends-result').appendChild(item)
            } else if (e.target.classList.contains('btn-remove')) {
                let item = e.target.parentNode;

                e.target.classList.remove('btn_cross-45deg', 'btn-remove');
                e.target.classList.add('btn_cross', 'btn-add');
                this.container.querySelector('#allFriends-result').appendChild(item)
            }
        })
    }

}
