## PRIVACY

Eklentinin çalışabilmesi için twitter oturumunuzla ilgili bazı hassas bilgilere ihtiyaç var.

Hangi iznin neden istendiğini açıklayayım:

 - ### webRequest

Bir videoyu indirmek için ``https://twitter.com/i/api/2/timeline/conversation/[id].json`` adresine istek atıp videonun indirilebilir urlini öğrenmek gerekiyor. Fakat bu adrese istek atabilmek için ``x-guest-token`` ya da ``x-csrf-token`` ve ``authorization`` üst bilgilerine ihtiyaç var. Bu üç üst bilgisi ``webRequest`` sayesinde tweetlerin yüklenmesi için yapılan isteklerden toplanıyor.

Kullanılan yerler:
[chrome.webRequest.onSendHeaders](https://github.com/mstfsnc/twitter-video-downloader/blob/master/src/background/index.js#L19-L34)

 - ### storage

``webRequest`` sayesinde toplanan üst bilgiler daha sonra videoyu indirme sırasında kullanılmak üzere storagede saklanıyor. Bu bilgiler eklentiden dışarıya çıkmadığı gibi video indirme dışında bir amaçla kullanılmıyor.

Kullanılan yerler: 
[chrome.storage.sync.set](https://github.com/mstfsnc/twitter-video-downloader/blob/master/src/background/index.js#L29),
[chrome.storage.sync.get](https://github.com/mstfsnc/twitter-video-downloader/blob/master/src/background/api.js#L7)
