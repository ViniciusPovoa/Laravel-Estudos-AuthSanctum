<?php


namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{

    public function register(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $user->sendEmailVerificationNotification();

        $token = $user->createToken('apitoken')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    public function login(array $credentials): array|string
    {

        $user = User::where('email', $credentials['email']->first());

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return 'Credenciais inválidas';
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
