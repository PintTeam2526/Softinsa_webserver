package com.example.pint_26_mobile;

import android.database.CursorWindow;
import android.os.Bundle;
import io.flutter.embedding.android.FlutterActivity;
import java.lang.reflect.Field;

public class MainActivity extends FlutterActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            Field field = CursorWindow.class.getDeclaredField("sCursorWindowSize");
            field.setAccessible(true);
            field.set(null, 100 * 1024 * 1024); // 100MB
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
