const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const baseUrl = 'https://oldschool.runescape.wiki';
const itemCategoryUrl = `${baseUrl}/w/Category:Equipable_items`;
const allItemLinks = [];

async function fetchAllItems(currentPageUrl = itemCategoryUrl) {
  try {
    const response = await axios.get(currentPageUrl);
    const $ = cheerio.load(response.data);

    const itemLinks = [];
    $("div.mw-category").find('a').each((index, element) => {
      const linkUrl = $(element).attr('href');
      itemLinks.push(linkUrl);
    });

    allItemLinks.push(...itemLinks);

    const nextPageLink = $('a:contains("next page")').attr('href');
    if (nextPageLink) {
      await fetchAllItems(`${baseUrl}${nextPageLink}`);
    }
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

fetchAllItems().then(() => {
  const outputFilePath = allItemLinks.join('\n');
  fs.writeFileSync('item_links.txt', outputFilePath, 'utf8');
  console.log(`Item links saved to ${outputFilePath}`);
});