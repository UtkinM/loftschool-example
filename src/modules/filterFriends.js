class filterFriends {
    constructor(param) {
        this.param = param;
        this.initListeners()
    }

    filterFriends(input, list) {
        const chunck = input.value;

        for (let child of list.children) {
            let full = child.querySelector('.friends-list__name').innerText;

            if (this.isMatching(full, chunck)) {
                child.classList.remove('hidden')
            } else {
                child.classList.add('hidden')
            }
        }
    }

    isMatching(full, chunk) {
        return full.toUpperCase().indexOf(chunk.toUpperCase()) >= 0
    }

    initListeners() {
        this.param.forEach(item => {
            item.target.addEventListener('keyup', () => {
                this.filterFriends(item.target, item.result)
            })
        })
    }
}

export default (param) => {
    new filterFriends(param)
}