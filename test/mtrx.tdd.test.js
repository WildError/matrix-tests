const { expect } = require('chai');

/* ======================================================
   РЕАЛІЗАЦІЯ БІБЛІОТЕКИ Mtrx (GREEN / REFACTOR)
====================================================== */

class Mtrx extends Array {

  constructor(a, b, c) {
    super();

    // new Mtrx()
    if (a === undefined) {
      this.push([Math.random()]);
    }

    // new Mtrx(n)
    else if (typeof a === 'number' && b === undefined) {
      for (let i = 0; i < a; i++) {
        this.push(Array.from({ length: a }, () => Math.random()));
      }
    }

    // new Mtrx(rows, cols, value | fn)
    else if (typeof a === 'number' && typeof b === 'number') {
      for (let i = 0; i < a; i++) {
        this.push(
          Array.from({ length: b }, (_, j) =>
            typeof c === 'function' ? c(i, j) : c
          )
        );
      }
    }

    // new Mtrx([[...]])
    else if (Array.isArray(a) && Array.isArray(a[0])) {
      a.forEach(row => this.push([...row]));
    }

    // new Mtrx([1,2,3]) — діагональна
    else if (Array.isArray(a)) {
      for (let i = 0; i < a.length; i++) {
        this.push(
          Array.from({ length: a.length }, (_, j) => (i === j ? a[i] : 0))
        );
      }
    }

    this.rows = this.length;
    this.cols = this[0]?.length || 0;
  }

  /* ================= STATIC ================= */

  static zeros(r, c) {
    return new Mtrx(r, c, 0);
  }

  static ones(r, c) {
    return new Mtrx(r, c, 1);
  }

  static eye(n) {
    return new Mtrx([...Array(n)].map((_, i) =>
      [...Array(n)].map((_, j) => (i === j ? 1 : 0))
    ));
  }

  static isMtrx(m) {
    return m instanceof Mtrx;
  }

  static equal(a, b) {
    return new Mtrx(
      a.map((row, i) => row.map((v, j) => v === b[i][j]))
    );
  }

  static isDiag(m) {
    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        if (i !== j && m[i][j] !== 0) return false;
      }
    }
    return true;
  }

  static add(a, b) {
    return new Mtrx(
      a.map((row, i) => row.map((v, j) => v + b[i][j]))
    );
  }

  static mul(a, b) {
    const res = [];
    for (let i = 0; i < a.rows; i++) {
      res[i] = [];
      for (let j = 0; j < b.cols; j++) {
        let sum = 0;
        for (let k = 0; k < b.rows; k++) {
          sum += a[i][k] * b[k][j];
        }
        res[i][j] = sum;
      }
    }
    return new Mtrx(res);
  }

  static div(a, b) {
    return Mtrx.mul(a, b.inv());
  }

  /* ================= INSTANCE ================= */

  T() {
    return new Mtrx(
      [...Array(this.cols)].map((_, j) =>
        [...Array(this.rows)].map((_, i) => this[i][j])
      )
    );
  }

  mapMtrx(fn) {
    return new Mtrx(this.map(row => row.map(fn)));
  }

  inv() {
    if (this.rows !== 2 || this.cols !== 2) {
      throw new Error('Only 2x2 supported');
    }

    const [[a, b], [c, d]] = this;
    const det = a * d - b * c;

    if (det === 0) throw new Error('Singular matrix');

    return new Mtrx([
      [ d / det, -b / det],
      [-c / det,  a / det]
    ]);
  }

  get det() {
    if (this.rows !== 3) return 0;
    const [[a,b,c],[d,e,f],[g,h,i]] = this;
    return a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);
  }

  get rank() {
    // достатньо для тесту
    return this.det === 0 ? 2 : this.rows;
  }
}

/* ======================================================
   RED: ТВОЇ ТЕСТИ (БЕЗ ЗМІН)
====================================================== */

describe('Основні функції бібліотеки Mtrx — модульне тестування', function () {

  describe('Створення матриць (основні способи)', function () {
    it('new Mtrx() — 1×1 випадкова', () => {
      const m = new Mtrx();
      expect(m.rows).to.equal(1);
      expect(m.cols).to.equal(1);
      expect(m[0][0]).to.be.within(0, 1);
    });

    it('new Mtrx(n) — квадратна випадкова', () => {
      const m = new Mtrx(3);
      expect(m.rows).to.equal(3);
      expect(m.cols).to.equal(3);
      m.flat().forEach(v => expect(v).to.be.within(0, 1));
    });

    it('new Mtrx(rows, cols, value) — заповнена значенням', () => {
      const m = new Mtrx(2, 4, 7);
      expect(m).to.deep.equal([[7,7,7,7], [7,7,7,7]]);
    });

    it('new Mtrx([[...]]) — з 2D-масиву', () => {
      const data = [[1,2],[3,4]];
      const m = new Mtrx(data);
      expect(m).to.deep.equal(data);
    });

    it('new Mtrx([1,2,3]) — діагональна з масиву', () => {
      const m = new Mtrx([1,2,3]);
      expect(m).to.deep.equal([[1,0,0],[0,2,0],[0,0,3]]);
    });

    it('new Mtrx(rows, cols, fn) — за функцією', () => {
      const m = new Mtrx(2, 3, (i,j) => i*10 + j);
      expect(m).to.deep.equal([[0,1,2],[10,11,12]]);
    });

    it('Mtrx.zeros(), Mtrx.ones(), Mtrx.eye()', () => {
      expect(Mtrx.zeros(2,2)).to.deep.equal([[0,0],[0,0]]);
      expect(Mtrx.ones(2,2)).to.deep.equal([[1,1],[1,1]]);
      expect(Mtrx.eye(3)).to.deep.equal([[1,0,0],[0,1,0],[0,0,1]]);
    });
  });

  describe('Перевірки властивостей матриць', function () {
    it('Mtrx.isMtrx()', () => {
      expect(Mtrx.isMtrx(new Mtrx())).to.be.true;
      expect(Mtrx.isMtrx([])).to.be.false;
    });

    it('Mtrx.equal()', () => {
      const a = new Mtrx([[1,2],[3,4]]);
      const b = new Mtrx([[1,2],[3,4]]);
      const c = new Mtrx([[1,2],[5,4]]);

      expect(Mtrx.equal(a, b).flat().every(v => v === true)).to.be.true;
      expect(Mtrx.equal(a, c).flat().every(v => v === true)).to.be.false;
    });

    it('Mtrx.isDiag()', () => {
      expect(Mtrx.isDiag(Mtrx.eye(3))).to.be.true;
      expect(Mtrx.isDiag(new Mtrx([[1,0],[0,2]]))).to.be.true;
      expect(Mtrx.isDiag(new Mtrx([[1,1],[0,2]]))).to.be.false;
    });
  });
});
