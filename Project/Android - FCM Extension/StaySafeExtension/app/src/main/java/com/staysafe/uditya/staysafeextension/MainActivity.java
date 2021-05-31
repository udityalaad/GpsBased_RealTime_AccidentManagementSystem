package com.staysafe.uditya.staysafeextension;

import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.iid.FirebaseInstanceId;

public class MainActivity extends AppCompatActivity {
    private FirebaseDatabase mDatabase;

    AlertDialog.Builder BUILDER;

    public MainActivity() {

    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        BUILDER = new AlertDialog.Builder(MainActivity.this);

        mDatabase = FirebaseDatabase.getInstance();

        Uri uri = getIntent().getData();
        if (uri != null) {  // When direcly open by main 'Stay Safe' application
            String user_id = uri.getQueryParameter("userId");

            Update_Token_To_Database(user_id, Set_Up_FCM());

            finish();

//            BUILDER.setTitle("Success")
//                    .setMessage("Messaging Service has been enabled successfully.")
//                    .setPositiveButton("OK", new DialogInterface.OnClickListener() {
//                        @Override
//                        public void onClick(DialogInterface dialog, int which) {
//                            System.exit(0);
//                        }
//                    });
//            BUILDER.show();

        } else {  // When opened explicity by the 'User'
            Intent intent = new Intent(Intent.ACTION_MAIN);
            intent.setComponent(new ComponentName("com.example.Maps", "com.example.Maps.MainActivity"));
            startActivity(intent);

            finish();

//            BUILDER.setTitle("Sorry")
//                    .setMessage("This extension can only be used by the main 'Stay Safe' application.")
//                    .setPositiveButton("OK", new DialogInterface.OnClickListener() {
//                        @Override
//                        public void onClick(DialogInterface dialog, int which) {
//                            System.exit(0);
//                        }
//                    });
//            BUILDER.show();
        }
    }


    public String Set_Up_FCM () {
        String refreshedToken = FirebaseInstanceId.getInstance().getToken();

//        AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
//        BUILDER.setTitle(refreshedToken)
//                .setMessage(refreshedToken)
//                .setPositiveButton("OK", new DialogInterface.OnClickListener() {
//                    @Override
//                    public void onClick(DialogInterface dialog, int which) {
//                    }
//                });
//        builder.show();

        return refreshedToken;
    }


    public void Update_Token_To_Database (String user_id, String token) {
        mDatabase.getReference("User/" + user_id + "/FCM_Token").setValue(token);
    }
}
