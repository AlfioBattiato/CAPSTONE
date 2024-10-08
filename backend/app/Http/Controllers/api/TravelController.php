<?php

namespace App\Http\Controllers\api;

use App\Models\Travel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreTravelRequest;
use App\Http\Requests\UpdateTravelRequest;

class TravelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Travel::with('users', 'metas');

        if ($request->has('start_date')) {
            $query->where('departure_date', '>=', $request->input('start_date'));
        }

        if ($request->has('city')) {
            $query->where('start_location', 'like', '%' . $request->input('city') . '%');
        }

        if ($request->has('cc')) {
            $query->where('cc_moto', '>=', $request->input('cc'));
        }

        if ($request->has('participants')) {
            $query->whereHas('users', function ($q) use ($request) {
                $q->havingRaw('COUNT(users.id) >= ?', [$request->input('participants')]);
            });
        }

        if ($request->has('days')) {
            $query->whereRaw('DATEDIFF(expiration_date, departure_date) + 1 <= ?', [$request->input('days')]);
        }

        if ($request->has('types')) {
            $types = explode(',', $request->input('types'));
            $query->where(function ($q) use ($types) {
                foreach ($types as $type) {
                    $q->orWhere('type_moto', 'like', '%' . $type . '%');
                }
            });
        }

        $travels = $query->get();

        return response()->json($travels);
    }





    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $request->validate([
        'start_location' => 'required|string|max:255',
        'lat' => 'required|numeric',
        'lon' => 'required|numeric',
        'type_moto' => 'required|string|max:255',
        'cc_moto' => 'required|string',
        'departure_date' => 'required|date',
        'expiration_date' => 'required|date',
        'days' => 'required|integer',
    ]);

    $data = $request->only([
        'start_location',
        'lat',
        'lon',
        'type_moto',
        'cc_moto',
        'departure_date',
        'expiration_date',
        'days',
    ]);

    $travel = Travel::create($data);

    // Aggiungi l'utente creatore con il ruolo corretto
    $travel->users()->syncWithoutDetaching([auth()->user()->id => ['role' => 'creator_travel', 'active' => true]]);

    // Aggiungi altri utenti con ruolo guest se specificati nel request
    if ($request->has('selected_users')) {
        $selectedUsers = $request->input('selected_users');
        foreach ($selectedUsers as $userId) {
            $travel->users()->syncWithoutDetaching([$userId => ['role' => 'guest', 'active' => true]]);
        }
    }

    $travel->load('users'); // Assicurati di caricare correttamente la relazione

    return response()->json($travel, 201);
}




    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Trova il viaggio specificato con le relazioni caricate
        $travel = Travel::with('users', 'metas')->findOrFail($id);

        // Ottieni l'utente autenticato
        $authUser = Auth::user();

        // Trova il ruolo dell'utente autenticato nel viaggio
        $role = $travel->users()->where('user_id', $authUser->id)->first()->pivot->role ?? null;

        // Aggiungi il ruolo ai dati del viaggio
        $travelData = $travel->toArray();
        $travelData['auth_user_role'] = $role;

        // Restituisci i dettagli del viaggio come risposta JSON
        return response()->json($travelData);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Travel $travel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTravelRequest $request, Travel $travel)
    {
        // Verifica che l'utente autenticato sia il creatore del viaggio
        $authUser = Auth::user();
        $role = $travel->users()->where('user_id', $authUser->id)->first()->pivot->role ?? null;

        if ($role !== 'creator_travel') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'start_location' => 'required|string|max:255',
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
            'type_moto' => 'required|string|max:255',
            'cc_moto' => 'required|string',
            'departure_date' => 'required|date',
            'expiration_date' => 'required|date',
            'days' => 'required|integer',
        ]);

        if ($request->has('start_location')) {
            $travel->start_location = $request->input('start_location');
        }

        if ($request->has('lat')) {
            $travel->lat = $request->input('lat');
        }

        if ($request->has('lon')) {
            $travel->lon = $request->input('lon');
        }

        if ($request->has('type_moto')) {
            $travel->type_moto = $request->input('type_moto');
        }

        if ($request->has('cc_moto')) {
            $travel->cc_moto = $request->input('cc_moto');
        }

        if ($request->has('departure_date')) {
            $travel->departure_date = $request->input('departure_date');
        }
        if ($request->has('expiration_date')) {
            $travel->expiration_date = $request->input('expiration_date');
        }
        if ($request->has('days')) {
            $travel->days = $request->input('days');
        }

        $travel->save();

        return response()->json($travel);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Travel $travel)
    {
        // Verifica che l'utente autenticato sia il creatore del viaggio
        $authUser = Auth::user();
        $user = $travel->users()->where('user_id', $authUser->id)->first();

        if ($user) {
            $role = $user->pivot->role;
        } else {
            $role = null;
        }

        if ($role !== 'creator_travel') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Elimina il viaggio
        $travel->delete();

        // Restituisci una risposta di successo
        return response()->json(['message' => 'Travel deleted successfully']);
    }
    public function addGuest(Request $request, $travelId)
    {
        // Trova il viaggio specificato
        $travel = Travel::findOrFail($travelId);

        // Verifica che l'utente non sia già stato aggiunto come guest
        $userId = Auth::id();
        if ($travel->users()->where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'User is already a guest or creator of this travel'], 400);
        }

        // Aggiungi l'utente autenticato come guest con active impostato a false
        $travel->users()->attach($userId, ['role' => 'guest', 'active' => false]);

        return response()->json(['message' => 'Request to join travel as guest submitted successfully'], 200);
    }
    public function approveGuest(Request $request, $travelId, $userId)
{
    $travel = Travel::findOrFail($travelId);
    $creatorId = $travel->users()->wherePivot('role', 'creator_travel')->first()->id;

    if (Auth::id() === $creatorId) {
        $user = $travel->users()->where('user_id', $userId)->first();
        if ($user) {
            $travel->users()->updateExistingPivot($userId, ['active' => 1]);

            // Aggiungi l'utente alla chat del viaggio
            $chat = $travel->chat;
            if ($chat) {
                try {
                    $chat->users()->syncWithoutDetaching([$userId]);
                    Log::info("User $userId successfully added to chat for travel $travelId.");
                } catch (\Exception $e) {
                    Log::error("Failed to add user $userId to chat for travel $travelId: " . $e->getMessage());
                }
            } else {
                Log::error("Chat not found for travel $travelId.");
            }

            return response()->json(['message' => 'Guest approved successfully', 'user' => $user]);
        } else {
            return response()->json(['message' => 'User not found in travel participants'], 404);
        }
    } else {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
}

    public function rejectGuest(Request $request, $travelId, $userId)
    {
        $travel = Travel::findOrFail($travelId);
        $creatorId = $travel->users()->wherePivot('role', 'creator_travel')->first()->id;

        if (Auth::id() === $creatorId) {
            $user = $travel->users()->where('user_id', $userId)->first();
            if ($user) {
                $travel->users()->detach($userId);
                return response()->json(['message' => 'Guest rejected successfully']);
            } else {
                return response()->json(['message' => 'User not found in travel participants'], 404);
            }
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    }
}
