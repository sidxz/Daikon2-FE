import axios from "axios";

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchPubMedData = async (
  pubmedId,
  retries = 3,
  backoff = 3000
) => {
  try {
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pubmedId}&retmode=json`;
    const response = await axios.get(url);
    const data = response.data;
    const article = data.result[pubmedId];
    const title = article.title;
    const link = `https://pubmed.ncbi.nlm.nih.gov/${pubmedId}/`;
    const pubDate = article.pubdate;
    const authors = article.authors.map((author) => author.name).join(", ");
    return { title, link, pubDate, authors };
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      // Rate limit error, wait for backoff time and retry
      await delay(backoff);
      return fetchPubMedData(pubmedId, retries - 1, backoff * 2);
    } else {
      throw error;
    }
  }
};
