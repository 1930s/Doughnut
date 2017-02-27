module.exports = {
  feed: {
    title: "Test Podcast",
    site_url: "http://example.com",
    pubDate: "Sat, 11 Feb 2017 02:11:29 +0000",
    language: "en",
    copyright: "Test Co.",
    description: "Lorem ipsum sit amet dolor.",
    image_url: "http://localhost:3000/image.jpg"
  },
  items: [
    {
      title: "First Item",
      description: "Use this for the content. It can include html.",
      url: 'http://example.com/article1?this&that',
      guid: '1123',
      categories: ['Category 1','Category 2','Category 3','Category 4'],
      author: 'Guest Author',
      date: 'May 27, 2012'
    },
    {
      title: "Second Item",
      description: "Use this for the content. It can include html.",
      url: 'http://example.com/article2?this&that',
      guid: '2123',
      categories: ['Category 1','Category 2','Category 3','Category 4'],
      author: 'Guest Author',
      date: 'May 28, 2012'
    },
    {
      title: "Third Item",
      description: "Use this for the content. It can include html.",
      url: 'http://example.com/article3?this&that',
      guid: '3123',
      categories: ['Category 1','Category 2','Category 3','Category 4'],
      author: 'Guest Author',
      date: 'May 29, 2012'
    }
  ]
}