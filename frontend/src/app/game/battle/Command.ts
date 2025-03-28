export default class Command {
    func: Function;
    target: string; 

    constructor(_func: Function, _target: string) {
        this.func = _func;
        this.target = _target;
    }

    public exec() {
        this.func(this.target);
    }
}