import Piece from './piece'

export default class Hex {
    q: number;
    r: number;
    coord: string;
    piece?: Piece;
    adj: Set<Hex>;

    constructor(_r: number, _q: number) {
        this.q = _q;
        this.r = _r;
        this.coord = this.r.toString() + this.q.toString();
        this.piece = undefined;
        this.adj = new Set();
    }

    public addEdge(_hex: Hex) {
        this.adj.add(_hex);
    }
}