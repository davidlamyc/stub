const comments = [
    {
      "postId": 99,
      "id": 491,
      "name": "eos enim odio",
      "email": "Maxwell@adeline.me",
      "body": "natus commodi debitis cum ex rerum alias quis\nmaxime fugiat fugit sapiente distinctio nostrum tempora\npossimus quod vero itaque enim accusantium perferendis\nfugit ut eum labore accusantium voluptas"
    },
    {
      "postId": 99,
      "id": 492,
      "name": "consequatur alias ab fuga tenetur maiores modi",
      "email": "Amina@emmet.org",
      "body": "iure deleniti aut consequatur necessitatibus\nid atque voluptas mollitia\nvoluptates doloremque dolorem\nrepudiandae hic enim laboriosam consequatur velit minus"
    },
    {
      "postId": 99,
      "id": 493,
      "name": "ut praesentium sit eos rerum tempora",
      "email": "Gilda@jacques.org",
      "body": "est eos doloremque autem\nsimilique sint fuga atque voluptate est\nminus tempore quia asperiores aliquam et corporis voluptatem\nconsequatur et eum illo aut qui molestiae et amet"
    },
    {
      "postId": 99,
      "id": 494,
      "name": "molestias facere soluta mollitia totam dolorem commodi itaque",
      "email": "Kadin@walter.io",
      "body": "est illum quia alias ipsam minus\nut quod vero aut magni harum quis\nab minima voluptates nemo non sint quis\ndistinctio officia ea et maxime"
    },
    {
      "postId": 99,
      "id": 495,
      "name": "dolor ut ut aut molestiae esse et tempora numquam",
      "email": "Alice_Considine@daren.com",
      "body": "pariatur occaecati ea autem at quis et dolorem similique\npariatur ipsa hic et saepe itaque cumque repellendus vel\net quibusdam qui aut nemo et illo\nqui non quod officiis aspernatur qui optio"
    }
]

module.exports = function(req) {
    const amendedComments = [];
    comments.forEach(comment => {
        const amendedComment = Object.assign({}, comment, { postId: req.resourceIds.id });
        amendedComments.push(amendedComment);
    })

    return amendedComments;
};
