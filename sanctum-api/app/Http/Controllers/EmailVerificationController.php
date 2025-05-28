<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function sendVerificationEmail(Request $request){

        if($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email já verificado'], 422);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Link de verificação enviado com sucesso']);
    }

public function verify(Request $request, $id, $hash)
{
    $user = User::find($id);

    if (!$user) {
        return redirect(config('app.frontend_url').'/email-verify?error=user_not_found');
    }

    if (!hash_equals($hash, sha1($user->email))) {
        return redirect(config('app.frontend_url').'/email-verify?error=invalid_verification_link');
    }

    if ($user->hasVerifiedEmail()) {
        return redirect(config('app.frontend_url').'/email-verify?email_already_verified=1');
    }

    if ($user->markEmailAsVerified()) {
        event(new Verified($user));
    }

    return redirect(config('app.frontend_url').'/email-verify?email_verified=1');
}
}
