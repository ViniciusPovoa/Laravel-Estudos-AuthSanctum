<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function sendVerificationEmail(Request $request){
        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Link de verificação enviado com sucesso']);
    }

    public function verify(EmailVerificationRequest $request){
        $request->fulfill();

        return response()->json(['message' => 'Email verificado com sucesso.']);
    }
}
