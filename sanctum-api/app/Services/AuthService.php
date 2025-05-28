<?php


namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\URL;

class AuthService
{

public function register(array $data): array
{
    $user = User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => bcrypt($data['password']),
    ]);

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    $user->sendEmailVerificationNotification();

    return [
        'user' => $user,
        'verification_url' => $verificationUrl 
    ];
}

    public function login(array $credentials): array|string
    {

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return 'Credenciais inválidas';
        }

        if(!$user->hasVerifiedEmail()){
            return response()->json(['message' => 'Precisa verificar o email'], 403);
        }

        $token = $user->createToken('apitoken')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    public function logout(User $user): string
    {
        $user->tokens()->delete();

      return response()->json(['message' => 'Logout efetuado com sucesso']);
    }
}
