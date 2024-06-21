<?php

namespace App\Http\Controllers\api;

use App\Models\Travel;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
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
        $query->where(function($q) use ($types) {
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
    $travel->load('users'); // Aggiusta in base alla relazione effettiva

    return response()->json($travel, 201);
}

    /**
     * Display the specified resource.
     */
    public function show(Travel $travel)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Travel $travel)
    {
        //
    }
}
