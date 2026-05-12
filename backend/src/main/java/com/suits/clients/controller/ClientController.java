package com.suits.clients.controller;

import com.suits.clients.dto.ClientRequest;
import com.suits.clients.dto.ClientResponse;
import com.suits.clients.service.ClientService;
import com.suits.common.dto.ApiResponse;
import com.suits.common.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.UUID;

@RestController
@RequestMapping("/clients")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Tag(name = "Clients", description = "Client management endpoints")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('READ_CLIENTS')")
    @Operation(summary = "Get all clients", description = "Retrieve paginated list of all active clients")
    public ResponseEntity<ApiResponse<PageResponse<ClientResponse>>> getAllClients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        PageResponse<ClientResponse> response = clientService.getAllClients(pageable);
        return ResponseEntity.ok(ApiResponse.ok(response, "Clients fetched successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_CLIENTS')")
    @Operation(summary = "Get client by ID", description = "Retrieve detailed information of a specific client")
    public ResponseEntity<ApiResponse<ClientResponse>> getClientById(@PathVariable UUID id) {
        ClientResponse response = clientService.getClientById(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Client fetched successfully"));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_CLIENTS')")
    @Operation(summary = "Create new client", description = "Create a new client record")
    public ResponseEntity<ApiResponse<ClientResponse>> createClient(@Valid @RequestBody ClientRequest request) {
        ClientResponse response = clientService.createClient(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Client created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_CLIENTS')")
    @Operation(summary = "Update client", description = "Update an existing client record")
    public ResponseEntity<ApiResponse<ClientResponse>> updateClient(
            @PathVariable UUID id,
            @Valid @RequestBody ClientRequest request) {
        ClientResponse response = clientService.updateClient(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Client updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_CLIENTS')")
    @Operation(summary = "Delete client", description = "Soft delete a client record")
    public ResponseEntity<ApiResponse<Void>> deleteClient(@PathVariable UUID id) {
        clientService.deleteClient(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Client deleted successfully"));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('READ_CLIENTS')")
    @Operation(summary = "Search clients", description = "Search clients by name")
    public ResponseEntity<ApiResponse<PageResponse<ClientResponse>>> searchClients(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        PageResponse<ClientResponse> response = clientService.searchClients(name, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response, "Clients search completed"));
    }
}
