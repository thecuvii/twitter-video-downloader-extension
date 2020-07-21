### Gizlilik

Videonun mp4 urlini Twitter' ın API adresinden isterken bazı header bilgileri ("x-guest-token", "x-csrf-token", "authorization") gerekiyor. Bu bilgileri sayfa yüklenirken https://api.twitter.com/2/timeline endpointine atılan isteklerden alıp, chrome.storage API aracılığı ile tarayıcıda saklıyorum.

Saklamadan önce bilgileri SJCL (https://github.com/bitwiseshiftleft/sjcl) kütüphanesi aracılığı ile encrypt ediyorum. Encrypt ve saklama işlemi sırayla şu şekilde gerçekleşiyor:

1) Twitter API istek olduğunda header bilgilerini bir dizide topla
2) SJCL.random.randomWords metodu aracılığı ile bir rastgele bir key üret
3) Bilgilerin bulunduğu diziyi SJCL.encrypt metoduna key ile encrypt et
4) Encrypt edilmiş veriyi chrome.storage API aracılığı ile tarayıcıda sakla

Bir video indirilmek istendiğinde encrypt edilmiş bilgiler SCJL.decrypt metodu aracılığı ile geri çözülüyor. Üretilen KEY her yeni veri saklamak istendiğinde rastgele bir şekilde yeniden oluşturuluyor. Decrypt sırasında bu KEY bilgisine ihtiyaç duyulduğu için bu bilgiyi bir değişkende saklıyorum. Bu değişkene daha üst ya da farklı bir scope dan erişilmemesi için bir function scope unda bıraktım.
