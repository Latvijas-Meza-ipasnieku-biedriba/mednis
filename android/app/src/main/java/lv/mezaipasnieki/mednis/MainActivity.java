package lv.mezaipasnieki.mednis;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.byteowls.capacitor.oauth2.OAuth2ClientPlugin;
import com.whitestein.securestorage.SecureStoragePlugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(OAuth2ClientPlugin.class);
      add(SecureStoragePlugin.class);
    }});
  }
}
