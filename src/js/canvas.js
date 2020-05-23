class Canvas {
    constructor(el, comments) {
        this.el  = el;
        this.w = 500;
        this.h = 300;
       
        this.arr = comments;
        this.timer = null;
    }
    draw() {
        let ctx = this.el.getContext('2d');
        ctx.font = '20px Microsoft YaHei';
        ctx.clearRect(0, 10, this.w, this.h);
        for (let i = 0; i < this.arr.length; i++) {
            ctx.fillStyle = this.arr[i].c;
            ctx.fillext(this.arr[i].content, this.arr[i].l, this.arr[i].t);
            this.arr[i].l -= 1;
        }
    }

}
export {
    Canvas
}