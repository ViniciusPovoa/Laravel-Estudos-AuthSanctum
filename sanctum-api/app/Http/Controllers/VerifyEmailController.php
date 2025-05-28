<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Illuminate\Routing\Controller;
use App\Models\User;

class VerifyEmailController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = User::findOrFail($request->route('id'));

        if(!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))){
            return response() ->json(['message' => 'Hash invalido'], 403);
        }

        if($user->hasVerifiedEmail()){
            return response()->json(['message' => 'Email já verificado']);

        }

        if($user -> markEmailAsVerified()){
            event(new Verified($user));
        }

        return response()->json(['message' => "email verificado com sucesso"]);
    }
}
