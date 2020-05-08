function importImages(r) {
  let imgs = {};
  r.keys().map(item => { imgs[item.replace('./', '').replace('.png', '')] = r(item); });
  return imgs;
}

const images = importImages(require.context('./', false, /\.png$/));

export default images;
