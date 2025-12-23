const { expect } = require('chai');
const Mtrx = require('mtrx');

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

    it('Mtrx.equal() — порівняння матриць', () => {
      const a = new Mtrx([[1,2],[3,4]]);
      const b = new Mtrx([[1,2],[3,4]]);
      const c = new Mtrx([[1,2],[5,4]]);

      expect(Mtrx.equal(a, b).flat().every(v => v === true)).to.be.true;
      expect(Mtrx.equal(a, c).flat().every(v => v === true)).to.be.false;
    });

    it('Mtrx.isDiag() — діагональна матриця', () => {
      expect(Mtrx.isDiag(Mtrx.eye(3))).to.be.true;
      expect(Mtrx.isDiag(new Mtrx([[1,0],[0,2]]))).to.be.true;
      expect(Mtrx.isDiag(new Mtrx([[1,1],[0,2]]))).to.be.false;
    });
  });

describe('Арифметичні операції (статичні)', function () {
  const a = new Mtrx([[1, 2], [3, 4]]);
  const b = new Mtrx([[5, 6], [7, 8]]);

  it('Mtrx.add() — додавання', () => {
    expect(Mtrx.add(a, b)).to.deep.equal([[6, 8], [10, 12]]);
  });

  it('Mtrx.mul() — множення матриць', () => {
    expect(Mtrx.mul(a, b)).to.deep.equal([[19, 22], [43, 50]]);
  });

it('Mtrx.div() — матричне ділення (a * inv(b))', () => {
  const a = new Mtrx([[1, 2], [3, 4]]);
  const b = new Mtrx([[5, 6], [7, 8]]);

  const result = Mtrx.div(a, b);

  expect(result[0][0]).to.be.closeTo(3,  1e-10);
  expect(result[0][1]).to.be.closeTo(-2, 1e-10);
  expect(result[1][0]).to.be.closeTo(2,  1e-10);
  expect(result[1][1]).to.be.closeTo(-1, 1e-10);
});
});


  describe('Методи екземпляра (основні)', function () {
    it('.T() — транспонування', () => {
      const m = new Mtrx([[1,2,3],[4,5,6]]);
      expect(m.T()).to.deep.equal([[1,4],[2,5],[3,6]]);
    });

    it('.inv() — обернена матриця', () => {
      const m = new Mtrx([[4,7],[2,6]]);
      const inv = m.inv();
      expect(inv[0][0]).to.be.closeTo( 0.6, 1e-10);
      expect(inv[0][1]).to.be.closeTo(-0.7, 1e-10);
      expect(inv[1][0]).to.be.closeTo(-0.2, 1e-10);
      expect(inv[1][1]).to.be.closeTo( 0.4, 1e-10);
    });

    it('.inv() — помилка при виродженій матриці', () => {
      const singular = new Mtrx([[1,2],[2,4]]);
      expect(() => singular.inv()).to.throw();
    });

    it('.mapMtrx() — застосування функції до кожного елемента', () => {
      const m = new Mtrx([[1,2],[3,4]]);
      const doubled = m.mapMtrx(x => x * 2);
      expect(doubled).to.deep.equal([[2,4],[6,8]]);
    });
  });

  describe('Властивості матриці', function () {
    const m = new Mtrx([[1,2,3],[4,5,6],[7,8,9]]);

    it('.rows та .cols', () => {
      expect(m.rows).to.equal(3);
      expect(m.cols).to.equal(3);
    });

    it('.det — визначник', () => {
      expect(m.det).to.equal(0); // вироджена матриця
    });

    it('.rank — ранг матриці', () => {
      expect(m.rank).to.equal(2); // ранг = 2
    });
  });
});