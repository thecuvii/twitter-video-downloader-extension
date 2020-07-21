## PRIVACY

Eklentinin çalışabilmesi için twitter oturumunuzla ilgili bazı hassas bilgilere ihtiyaç var. Bu bilgiler şifreli bir şekilde tarayıcıda saklanıyor ve kimseyle paylaşılmıyor.

Hangi iznin neden istendiğini açıklayayım:

 - ### webRequest

Bu izin sayesinde twitterdaki oturum bilgilerinizi saklayabiliyorum. Bu bilgiler sayesinde Twitter API adreslerine istek atıp videoyu indirebilmeniz sağlanacak. Örneğin bir videoyu indirmek istendiğinizde ``https://api.twitter.com/2/timeline/conversation/[id].json`` adresine istek atıp videonun indirilebilir urlini öğrenmek gerekiyor. Fakat bu adrese istek atabilmek için ``x-guest-token`` ya da ``x-csrf-token`` ve ``authorization`` üst bilgisine ihtiyaç var. ``webRequest`` izni sayesinde tweetlerin yüklenmesi için yapılan isteklerin üst bilgisine erişip bunlardan gerekli bilgileri tarayıcıda kriptolu bir şekilde saklıyorum.

 - ### storage

İsteklerden alınan üst bilgiler ``chrome.storage`` API aracılığı ile şifrelenerek tarayıcıda saklanıyor. Bu hassas bilgiler kimseyla paylaşılmıyor ya da tarayıcıdan dışarıya çıkmıyor. Bilgilerin açığa çıkma durumuna karşı tüm bilgiler [Stanford Javascript Crypto Library](http://bitwiseshiftleft.github.io/sjcl/) aracılığı ile kriptolu bir şekilde saklanıyor. Kripto sırasında kullanılan gizli anahtar her seferinde rastgele bir şekilde yeniden oluşturuluyor.

İlgili kod bloğunu görmek için [tıklayın.](https://github.com/mstfsnc/twitter-video-downloader/blob/master/src/background/index.js#L6-L19)

 - ### host

Twitter API adreslerine istek atabilmek ve yapılan istekleri görmek için bu izne ihtiyaç var. ``api.twitter.com/2/timeline`` adresine yapılan "xmlhttprequest" isteklerin üst bilgilerini görüyor ve ``api.twitter.com/2/timeline/conversation/[id].json`` adresine videonun bilgilerini almak için istek atıyor.

İlgili kod bloğunu görmek için [tıklayın.](https://github.com/mstfsnc/twitter-video-downloader/blob/master/src/background/api.js#L4-L23)