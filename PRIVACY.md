## PRIVACY

Eklentinin çalışabilmesi için twitter oturumunuzla ilgili bazı hassas bilgilere ihtiyaç var.

### webRequest

Bir videoyu indirmek için ``https://twitter.com/i/api/2/timeline/conversation/[id].json`` adresine istek atıp videonun indirilebilir urlini öğrenmek gerekiyor. Fakat bu adrese istek atabilmek için ``x-guest-token`` ya da ``x-csrf-token`` ve ``authorization`` üst bilgilerine ihtiyaç var. Bu bilgiler ``webRequest`` sayesinde tweetlerin yüklenmesi için yapılan isteklerden toplanıyor. Hiçbir yerde saklanmıyor ya da video indirme dışında kullanılmıyor.


Kullanılan yer:
[chrome.webRequest.onSendHeaders](https://github.com/mstfsnc/twitter-video-downloader/blob/master/src/background/index.js#L20-L45)