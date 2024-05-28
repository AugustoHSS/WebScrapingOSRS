const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://oldschool.runescape.wiki';
const itemLinksFilePath = path.join(__dirname, 'item_links.txt');
const items = [];


async function fetchIensStatus(){
    const itemLinks = fs.readFileSync(itemLinksFilePath, 'utf-8').split('\n');
    for (const itemLink of itemLinks) {
      console.log(itemLink)
      const itemUrl = `${baseUrl}${itemLink}`;
    try{
  
      const item = {
        itemName: "",
        stabAtk: 0,
        slashAtk: 0,
        crushAtk: 0,
        magicAtk: 0,
        rangedAtk: 0,
        stabDef: 0,
        slashDef: 0,
        crushDef: 0,
        magicDef: 0,
        rangedDef: 0,
        meleeStr: 0,
        rangedStr: 0,
        mageStr: 0,
        prayer: 0,
        itemSlot: "",
      };
  
      const response = await axios.get(itemUrl);
      const $ = cheerio.load(response.data);
      const itemName = $('span.mw-page-title-main').text();
      item.itemName = itemName;
      const itemStatus = $('table.infobox-bonuses').text();
      const regex = /(-\d+|\d+)/g;
      const values = itemStatus.match(regex);
      const keys = Object.keys(item);
      for (let i = 1; i < keys.length-1; i++) {
        item[keys[i]] = values[i-1];
      }
      const itemTable = $('a[title*="slot table"]').attr('title');
      const firstWord = itemTable.split(' ')[0];
      item.itemSlot = firstWord;
      items.push(item);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }
}

fetchIensStatus().then(() => {
  const outputFilePath = path.join(__dirname, 'item_status.txt');
  fs.writeFileSync(outputFilePath, JSON.stringify(items, null, 2));
  console.log(`Item status saved to ${outputFilePath}`);

});