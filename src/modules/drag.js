export default class drag {
    constructor(obj) {
        let {container, target} = obj;

        this.container = container;
        this.target = target.class;
        this.targetContainer = target.container;
        this.initDrag = this.initDrag.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.initListeners();
        this.state = {}
    }

    initListeners() {
        this.container.addEventListener('mousedown', this.initDrag);
        this.container.ondragstart = () => {
            return false;
        }
    }

    initDrag(e) {
        if (this.getParentByClass(e.target, this.target)) {
            if (e.which !== 1) {
                return;
            }
            let node = this.getParentByClass(e.target, this.target);
            let coord = node.getBoundingClientRect();

            this.state = {
                downX: e.pageX,
                downY: e.pageY,
                shiftY: e.pageY - (coord.top + node.scrollTop),
                shiftX: e.pageX - (coord.left + node.scrollLeft),
                node,
                nextSibling: node.nextElementSibling,
                parent: node.parentNode,
                width: `${node.clientWidth}px`,
                start: false
            };
            document.addEventListener('mousemove', this.startDrag);
            document.addEventListener('mouseup', this.stopDrag)

        }
    }

    startDrag(e) {
        if (!this.state.node) {
            return
        }
        if (!this.state.start) {
            let moveX = e.pageX - this.state.downX;
            let moveY = e.pageY - this.state.downY;

            if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {

                return;
            }
            this.moveNode();
            this.state.start = true;
        }

        this.state.node.style.top = `${e.pageY - this.state.shiftY}px`;
        this.state.node.style.left = `${e.pageX - this.state.shiftX}px`;

    }

    stopDrag(e) {
        if (!this.state.start) {
            this.abortDrag()
        }

        if (!this.getParentByClass(document.elementFromPoint(e.pageX, e.pageY), this.targetContainer)) {
            this.state.parent.insertBefore(this.state.node, this.state.nextSibling);
            this.state.node.style = '';
            this.abortDrag();

            return
        }
        this.node = this.getParentByClass(document.elementFromPoint(e.pageX, e.pageY), this.targetContainer);

        if (this.node.getAttribute('id') === this.state.parent.getAttribute('id')) {
            this.node.insertBefore(this.state.node, this.state.nextSibling);
        } else {
            this.styleElements(parent);
            this.node.appendChild(this.state.node);
        }
        this.state.node.style = '';
        this.abortDrag()
    }

    abortDrag() {
        this.state = {};
        document.body.style.userSelect = 'auto';
        document.removeEventListener('mousemove', this.startDrag);
        document.removeEventListener('mouseup', this.stopDrag);
    }

    getParentByClass(node, className) {
        do {
            if (!node.classList) {
                continue
            }
            if (node.classList.contains(className)) {

                return node
            }
        } while (node = node.parentNode);

        return false
    }

    moveNode() {
        let node = this.state.node;

        node.style.cssText = `width : ${node.clientWidth}px;
                        position: absolute;
                        z-index: 9999;
                        pointer-events:none`;
        document.body.style.userSelect = 'none';
        document.body.appendChild(node);
    }

    styleElements() {
        return true
    }
}