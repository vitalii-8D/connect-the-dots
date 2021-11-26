
export default class DotsArray{
   constructor(dots = []) {
      this._dots = dots
   }

   get dots() {
      return this._dots;
   }

   set dots(dots) {
      this._dots = dots;
   }

   get length() {
      return this._dots.length;
   }

   setAnimatedAll(state) {
      this._dots.forEach(d => d.setAnimated(state))
   }

   setSelectedAll(state) {
      this._dots.forEach(d => d.setSelected(state))
   }

   setAliveAll(state) {
      this._dots.forEach(d => d.setAlive(state))
   }

   reset() {
      this._dots = []
   }

   getIndexOf(dot) {
      const index = this._dots.indexOf(dot)
      return index === -1 ? undefined : index
   }

   getByIndex(index) {
      return this._dots.at(index)
   }

   add(dot) {
      this._dots.push(dot)
      return dot;
   }

   deleteByIndex(index) {
      const splicedArr = this._dots.splice(index, 1)
      return splicedArr[0];
   }

   deleteLast() {
      // lastDot.setSelected(false)
      return this._dots.pop()
   }

}
