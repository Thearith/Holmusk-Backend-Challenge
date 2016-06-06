export default function getHashCode(str){

  if (!str.length)
    return hash;

  let hash = str.split('')
    .map(char => char.charCodeAt(0))
    .reduce((sum, char) => {
      sum = ((sum<<5) - sum) + char;
      return sum & sum;
    }, 0);

  return hash;

};