<?php

namespace App\Http\Controllers\api;

use App\Models\Meta;
use App\Models\Travel;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreMetaRequest;
use App\Http\Requests\UpdateMetaRequest;

class MetaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Logica per mostrare una lista di risorse
    }

    /**
     * Store a newly created resource in storage.
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function store(Request $request)
    {
        $request->validate([
            'travel_id' => 'required|exists:travel,id',
            'name_location' => 'required|string|max:255',
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
        ]);

        $data = $request->only([
            'travel_id',
            'name_location',
            'lat',
            'lon',
        ]);

        $meta = Meta::create($data);
        return response()->json($meta, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Meta $meta)
    {
        // Logica per mostrare una risorsa specifica
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Meta $meta)
    {
        // Logica per mostrare il form di modifica (se necessario)
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMetaRequest $request, Meta $meta)
    {
        $request->validate([
            'travel_id' => 'required|exists:travel,id',
            'name_location' => 'required|string|max:255',
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
        ]);

           if ($request->has('travel_id')) {
            $meta->travel_id = $request->input('travel_id');
        }

        if ($request->has('name_location')) {
            $meta->name_location = $request->input('name_location');
        }
        if ($request->has('lat')) {
            $meta->lat = $request->input('lat');
        }

        if ($request->has('lon')) {
            $meta->lon = $request->input('lon');
        }


        $meta->save();

        return response()->json($meta);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Meta $meta)
    {
        $meta->delete();

        return response()->json(null, 204);
    }
    public function destroyAllByTravel(Travel $travel)
    {
        // Verifica che l'utente autenticato sia il creatore del viaggio
        $authUser = Auth::user();
        $role = $travel->users()->where('user_id', $authUser->id)->first()->pivot->role ?? null;

        if ($role !== 'creator_travel') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Elimina tutte le mete associate al viaggio
        Meta::where('travel_id', $travel->id)->delete();

        return response()->json(['message' => 'All metas associated with the travel have been deleted'], 204);
    }
}


